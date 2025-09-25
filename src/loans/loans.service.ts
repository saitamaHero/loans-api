import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AmortizationType } from './amortizations/interfaces';
import { AmortizationFactory } from './amortizations/amortization.factory';
import { AmortizationResult } from './amortizations/amortizations.calculator';
import { Loan } from './entities/loan.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AmortizationService } from './amortizations/amortizations.service';
import { LoanStatus, PaymentType } from './enums';
import { Amortization } from './amortizations/entities/amortization.entity';
import { PaymentsService } from './payments/payments.service';
import { CreateLoanDto } from './dtos/create-loan.dto';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loansRepository: Repository<Loan>,
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService,
    private readonly amortizationService: AmortizationService,
    private readonly amortizationFactory: AmortizationFactory,
  ) {}

  async findAll(): Promise<Loan[]> {
    return this.loansRepository.find();
  }

  async findById(id: number): Promise<Loan> {
    const loan = await this.loansRepository.findOne({ where: { id } });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    return loan;
  }

  async registerLoan(loanData: CreateLoanDto): Promise<Loan> {
    if (loanData.amount <= 0) {
      throw new Error('Loan amount must be positive');
    }

    if (loanData.interestRate < 0 || loanData.interestRate > 100) {
      throw new Error('Interest rate must be between 0 and 100');
    }

    const user = await this.usersService.findById(loanData.userId);

    if (!user) {
      throw new NotFoundException('Invalid user ID');
    }

    const registeredLoan = this.loansRepository.create({
      amortizationType: loanData.amortizationType || AmortizationType.FIXED,
      interestRate:
        loanData.interestRate > 1
          ? loanData.interestRate / 100
          : loanData.interestRate,
      amount: loanData.amount,
      duration: loanData.duration,
      startDate: loanData.startDate,
      dueDate: loanData.dueDate,
      user: { id: loanData.userId },
    });

    registeredLoan.status = LoanStatus.PENDING;

    await this.loansRepository.save(registeredLoan);

    await this.amortizationService.saveAmortizationResults(
      registeredLoan,
      this.calculateAmortization(registeredLoan),
    );

    return registeredLoan;
  }

  async getAmortizationResults(loanId: number): Promise<AmortizationResult[]> {
    const loan = await this.findById(loanId);

    if (!loan) {
      throw new Error('Loan not found');
    }

    return loan.amortizations;
  }

  async updateLoanStatus(id: number, status: LoanStatus): Promise<Loan> {
    const loan = await this.findById(id);

    if (!loan) {
      throw new Error('Loan not found');
    }

    if (loan.status === status) {
      return loan;
    }

    // ensure status can only be changed from PENDING to APPROVED or REJECTED
    if (loan.status === LoanStatus.APPROVED) {
      throw new BadRequestException('Cannot change status of an approved loan');
    } else if (loan.status === LoanStatus.REJECTED) {
      throw new BadRequestException('Cannot change status of a rejected loan');
    }

    loan.status = status;

    return await this.loansRepository.save(loan);
  }

  async findLoanWithAmortizations(id: number): Promise<Loan> {
    const loan = await this.loansRepository.findOne({
      where: { id },
      relations: ['amortizations'],
    });

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    return loan;
  }

  async findAmortizationsByLoanId(loanId: number): Promise<Amortization[]> {
    const loan = await this.findLoanWithAmortizations(loanId);

    if (!loan) {
      return [];
    }

    return loan.amortizations;
  }

  async makePayment(loanId: number, amount: number) {
    const loan = await this.findById(loanId);

    if (!loan || !this.isPaymentable(loan)) {
      throw new Error('Loan not found or not paymentable');
    }

    const nextAmortization =
      await this.amortizationService.getNextPayment(loanId);

    if (!nextAmortization) {
      throw new Error('No pending amortization found for this loan');
    }

    const totalPayment = nextAmortization.totalPayment;

    if (amount < totalPayment) {
      throw new Error(
        `Payment amount must be at least ${totalPayment.toFixed(2)}`,
      );
    }

    // this will mark the amortization as PAID
    const payment = await this.paymentsService.makePayment(
      loanId,
      totalPayment,
    );

    await this.amortizationService.markAsPaid(nextAmortization.id);

    return payment;
  }

  async makeExtraPayment(loanId: number, amount: number) {
    if (amount <= 0) {
      throw new Error('Extra payment amount must be positive');
    }

    const loan = await this.findById(loanId);

    if (!loan || !this.isPaymentable(loan)) {
      throw new Error('Loan not found');
    }

    let lastPaidAmortization =
      await this.amortizationService.getLastPaidAmortization(loanId);

    if (!lastPaidAmortization) {
      // if no amortization has been paid yet, treat as a normal payment
      const payment = await this.makePayment(loanId, amount);

      // if there's any remaining amount, treat it as an extra payment
      amount -= payment.amount;

      lastPaidAmortization =
        await this.amortizationService.getLastPaidAmortization(loanId);
    }

    const currentBalance =
      (lastPaidAmortization?.remainingBalance ?? 0) - amount;

    if (currentBalance < 0) {
      throw new Error(
        `Extra payment exceeds remaining balance of ${lastPaidAmortization?.remainingBalance.toFixed(
          2,
        )}`,
      );
    }
    // register extra payment
    const extraPayment = await this.paymentsService.makePayment(
      loanId,
      amount,
      PaymentType.EXTRA,
    );

    const amortizationResults = this.calculateAmortization(
      loan,
      currentBalance,
      lastPaidAmortization?.paymentNumber,
      // extraPayments,
    );

    console.table(amortizationResults);

    await this.amortizationService.saveAmortizationResults(
      loan,
      amortizationResults,
    );

    return extraPayment;
  }

  private calculateAmortization(
    loan: Loan,
    newPrincipalBalance?: number,
    startingPaymentNumber?: number,
    // extraPayments: ExtraPayment[] = [],
  ): AmortizationResult[] {
    const calculator = this.amortizationFactory.createAmortizationService(
      loan.amortizationType || AmortizationType.FIXED,
    );

    return calculator.calculate(
      loan,
      startingPaymentNumber ?? 1,
      newPrincipalBalance,
    );
  }

  private isPaymentable(loan: Loan): boolean {
    return loan.status === LoanStatus.APPROVED;
  }
}
