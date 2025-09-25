import { Injectable } from '@nestjs/common';
import { AmortizationType } from './interfaces';
import { AmortizationCalculator } from './amortizations.calculator';
import { FixedAmortizationService } from './fixed-amortization.service';
import { VariableAmortizationService } from './variable-amortization.service';

@Injectable()
export class AmortizationFactory {
  constructor(
    private readonly fixedService: FixedAmortizationService,
    private readonly variableService: VariableAmortizationService,
  ) {}

  createAmortizationService(
    amortizationType: AmortizationType,
  ): AmortizationCalculator {
    switch (amortizationType) {
      case AmortizationType.FIXED:
        return this.fixedService;
      case AmortizationType.VARIABLE:
        return this.variableService;
      default:
        throw new Error('Unsupported amortization type');
    }
  }
}
