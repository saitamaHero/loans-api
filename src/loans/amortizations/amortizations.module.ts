import { Module } from '@nestjs/common';
import { AmortizationFactory } from './amortization.factory';
import { FixedAmortizationService } from './fixed-amortization.service';
import { VariableAmortizationService } from './variable-amortization.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Amortization } from './entities/amortization.entity';
import { AmortizationService } from './amortizations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Amortization])],
  providers: [
    AmortizationFactory,
    FixedAmortizationService,
    VariableAmortizationService,
    AmortizationService,
  ],
  exports: [
    AmortizationFactory,
    FixedAmortizationService,
    VariableAmortizationService,
    AmortizationService,
  ],
})
export class AmortizationsModule {}
