import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';
import { Amortization } from './amortizations/entities/amortization.entity';
import { Payment } from './entities/payment.entity';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { LoanPaymentDto } from './dtos/loan-payment.dto';
import { LoanStatusDto } from './dtos/loan-status.dto';

@Controller('/api/v1.0/loan')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  async registerLoan(@Body() loanData: CreateLoanDto): Promise<any> {
    const loan = await this.loansService.registerLoan(loanData);

    return loan;
  }

  @Get()
  async getLoans(): Promise<Loan[]> {
    return await this.loansService.findAll();
  }

  @Get(':id')
  async getLoan(@Param('id') id: number): Promise<Loan | null> {
    const loan = await this.loansService.findById(id);

    if (!loan) {
      throw new NotFoundException('Loan not found');
    }

    return loan;
  }

  @Post('amor')
  async getAmortizations(
    @Body() loanPayload: { id: number },
  ): Promise<Amortization[]> {
    return await this.loansService.findAmortizationsByLoanId(loanPayload.id);
  }

  @Post('approval')
  async updateByStatus(@Body() loanApproval: LoanStatusDto): Promise<Loan> {
    const loan = await this.loansService.updateLoanStatus(
      loanApproval.loanId,
      loanApproval.status,
    );

    return loan;
  }

  @Post('payment')
  async makePayment(@Body() paymentPayload: LoanPaymentDto): Promise<Payment> {
    const payment = await this.loansService.makePayment(
      paymentPayload.loanId,
      paymentPayload.amount,
    );

    return payment;
  }

  @Post('abono')
  async makeExtraPayment(
    @Body() paymentPayload: LoanPaymentDto,
  ): Promise<Payment> {
    const payment = await this.loansService.makeExtraPayment(
      paymentPayload.loanId,
      paymentPayload.amount,
    );

    return payment;
  }
}
