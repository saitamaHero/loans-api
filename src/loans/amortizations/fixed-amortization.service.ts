import { Injectable } from '@nestjs/common';
import {
  AmortizationResult,
  AmortizationCalculator,
} from './amortizations.calculator';
import { Loan } from '../entities/loan.entity';

@Injectable()
export class FixedAmortizationService implements AmortizationCalculator {
  // Implementation for fixed amortization calculations with extra payments
  calculate(
    loan: Loan,
    startingPaymentNumber: number = 1,
    startingBalance?: number,
  ): AmortizationResult[] {
    let monthlyPayment = this.calculateFixedPayment(
      loan.amount,
      loan.interestRate,
      loan.duration,
    );

    const amortizationResults: AmortizationResult[] = [];
    const interestRate = this.getRate(loan.interestRate, 12); //TODO enhance for different duration units, or payment frequency

    let loanAmount = startingBalance ?? loan.amount;

    for (
      let i = startingPaymentNumber - 1;
      i < loan.duration && loanAmount > 0;
      i++
    ) {
      const paymentNumber = i + 1;
      const interest = loanAmount * interestRate;
      let principal = monthlyPayment - interest;

      if (principal > loanAmount) {
        principal = loanAmount;
      }

      loanAmount -= principal;

      if (monthlyPayment > principal + interest) {
        monthlyPayment = principal + interest; // Adjust last payment if necessary
      }

      amortizationResults.push({
        paymentNumber,
        principalAmount: principal,
        interestAmount: interest,
        totalPayment: monthlyPayment,
        remainingBalance: loanAmount > 0 ? loanAmount : 0,
      } as AmortizationResult);

      // Si el préstamo está pagado, detener
      if (loanAmount <= 0) break;
    }

    return amortizationResults;
  }

  private calculateFixedPayment(
    principal: number,
    annualRate: number,
    totalPayments: number,
  ): number {
    const monthlyRate = this.getRate(annualRate, 12); //TODO enhance for different duration units, or payment frequency

    if (monthlyRate === 0) {
      return principal / totalPayments;
    }

    return (
      (principal * monthlyRate) /
      (1 - Math.pow(1 + monthlyRate, -totalPayments))
    );
  }

  getRate(interestRate: number, period: number): number {
    //TODO this should consider duration unit and payment frequency
    return interestRate / period;
  }
}
