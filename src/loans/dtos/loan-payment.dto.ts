import { IsNumber } from 'class-validator';

export class LoanPaymentDto {
  @IsNumber()
  loanId: number;

  @IsNumber()
  amount: number;
}
