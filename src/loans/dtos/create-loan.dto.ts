import {
  IsNumber,
  IsEnum,
  IsDateString,
  IsOptional,
  Min,
  IsPositive,
  Max,
} from 'class-validator';
import { DurationUnit } from '../enums';
import { AmortizationType } from '../amortizations/interfaces';

export class CreateLoanDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  @Max(1)
  @Min(0)
  @IsPositive()
  interestRate: number;

  @IsNumber()
  @IsPositive()
  duration: number;

  @IsEnum(DurationUnit)
  durationUnit: DurationUnit;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  dueDate: Date;

  @IsEnum(AmortizationType)
  @IsOptional()
  amortizationType?: AmortizationType;
}
