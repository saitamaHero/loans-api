import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { LoanStatus } from '../enums';

export class LoanStatusDto {
  @IsNumber()
  @IsNotEmpty()
  loanId: number;

  @IsEnum(LoanStatus)
  @IsNotEmpty()
  status: LoanStatus;
}
