import { Injectable } from '@nestjs/common';
import {
  AmortizationResult,
  AmortizationCalculator,
} from './amortizations.calculator';
import { Loan } from '../entities/loan.entity';

@Injectable()
export class VariableAmortizationService implements AmortizationCalculator {
  calculate(
    loan: Loan,
    startingPaymentNumber: number = 1,
    startingBalance?: number,
  ): AmortizationResult[] {
    const amortizationResults: AmortizationResult[] = [];
    const interestRate = this.getRate(loan.interestRate, 12); //TODO enhance for different duration units, or payment frequency

    let monthlyPrincipal = loan.amount / loan.duration;
    let loanAmount = startingBalance ?? loan.amount;

    for (
      let i = startingPaymentNumber - 1;
      i < loan.duration && loanAmount > 0;
      i++
    ) {
      const paymentNumber = i + 1;
      const interest = loanAmount * interestRate;
      let principal = monthlyPrincipal;

      // Prevent overpayment
      if (principal > loanAmount) {
        principal = loanAmount;
      }

      loanAmount -= principal;

      if (monthlyPrincipal > principal + interest) {
        monthlyPrincipal = principal + interest; // Adjust last payment if necessary
      }

      amortizationResults.push({
        loanId: loan.id,
        paymentNumber,
        principalAmount: principal,
        interestAmount: interest,
        totalPayment: principal + interest,
        remainingBalance: loanAmount > 0 ? loanAmount : 0,
      } as AmortizationResult);

      // If loan is paid off, stop early
      if (loanAmount <= 0) break;
    }

    return amortizationResults;
  }

  public getRate(interestRate: number, period: number): number {
    return interestRate / period;
  }
}
