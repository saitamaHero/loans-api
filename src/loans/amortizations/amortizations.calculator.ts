import { Loan } from '../entities/loan.entity';

export interface AmortizationResult {
  paymentNumber: number;
  // paymentDate: Date;
  principalAmount: number;
  interestAmount: number;
  totalPayment: number;
  remainingBalance: number;
}

/***
 * Service to handle amortization calculations.
 */
export interface AmortizationCalculator {
  /**
   * Calculates the amortization schedule for a given loan.
   * @param loan The loan details for which to calculate the amortization schedule.
   */
  calculate(
    loan: Loan,
    startingPaymentNumber: number,
    startingBalance?: number,
  ): AmortizationResult[];
}
