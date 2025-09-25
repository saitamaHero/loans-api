import { Injectable } from '@nestjs/common';
import { AmortizationResult } from './amortizations.calculator';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Amortization } from './entities/amortization.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from '../entities/loan.entity';
import { AmortizationStatus } from '../enums';

@Injectable()
export class AmortizationService {
  constructor(
    @InjectRepository(Amortization)
    private readonly amortizationRepository: Repository<Amortization>,
  ) {}

  async getAmortizationResults(loanId: number): Promise<Amortization[]> {
    return await this.amortizationRepository.find({
      relations: ['loan'],
      where: { loan: { id: loanId } },
    });
  }

  async saveAmortizationResults(
    loan: Loan,
    results: AmortizationResult[],
  ): Promise<Amortization[]> {
    if (results.length === 0) {
      throw new Error('No amortization results to save');
    }

    const firstResult = results.sort(
      (a, b) => a.paymentNumber - b.paymentNumber,
    )[0];
    // Remove existing PENDING amortizations for the loan
    await this.amortizationRepository.delete({
      loan: { id: loan.id },
      paymentNumber: MoreThanOrEqual(firstResult.paymentNumber),
      status: AmortizationStatus.PENDING,
    });

    const amortizations = results.map((result) => {
      const amortization = new Amortization();
      amortization.loan = loan;
      amortization.paymentNumber = result.paymentNumber;
      amortization.principalAmount = result.principalAmount;
      amortization.interestAmount = result.interestAmount;
      amortization.totalPayment = result.totalPayment;
      amortization.remainingBalance = result.remainingBalance;
      return amortization;
    });

    return await this.amortizationRepository.save(amortizations);
  }

  async getNextPayment(loanId: number): Promise<Amortization | null> {
    const nextAmortization = await this.amortizationRepository.findOne({
      relations: ['loan'],
      where: {
        status: AmortizationStatus.PENDING,
        loan: { id: loanId },
      },
    });

    console.log({ nextAmortization });

    return nextAmortization || null;
  }

  async markAsPaid(amortizationId: number): Promise<Amortization> {
    const amortization = await this.amortizationRepository.findOne({
      where: { id: amortizationId },
    });

    if (!amortization) {
      throw new Error('Amortization not found');
    }

    amortization.status = AmortizationStatus.PAID;

    return await this.amortizationRepository.save(amortization);
  }

  async getLastPaidAmortization(loanId: number): Promise<Amortization | null> {
    const lastPaid = await this.amortizationRepository.findOne({
      relations: ['loan'],
      where: {
        status: AmortizationStatus.PAID,
        loan: { id: loanId },
      },
      order: { paymentNumber: 'DESC' },
    });

    return lastPaid || null;
  }
}
