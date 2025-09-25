import { Module } from '@nestjs/common';
import { LoansService } from './loans.service';
import { UsersModule } from '../users/users.module';
import { AmortizationsModule } from './amortizations/amortizations.module';
import { LoansController } from './loans.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { LoansControllerV2 } from './loans.v2.controller';
import { PaymentsService } from './payments/payments.service';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    UsersModule,
    AmortizationsModule,
    TypeOrmModule.forFeature([Loan, Payment]),
  ],
  providers: [LoansService, PaymentsService],
  exports: [LoansService],
  controllers: [LoansController, LoansControllerV2],
})
export class LoansModule {}
