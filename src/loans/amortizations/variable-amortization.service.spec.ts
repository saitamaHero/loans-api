import { Test, TestingModule } from '@nestjs/testing';
import { VariableAmortizationService } from './variable-amortization.service';
import { DurationUnit, Loan } from '../loans.service';

describe('VariableAmortizationService', () => {
  let service: VariableAmortizationService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VariableAmortizationService],
    }).compile();

    service = module.get<VariableAmortizationService>(
      VariableAmortizationService,
    );
  });

  //TODO: Add more tests for edge cases and error handling
  // e.g., zero interest rate, one payment, very high interest rate, etc.
  // Also consider tests for different duration units and payment frequencies when implemented
  // For now, we will focus on the core functionality
  // take into account down payments

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const scenarios = [
    {
      title: 'Standard case: 12 months, 12% interest, $10,000',
      loan: {
        id: 1,
        userId: 1,
        amount: 10000,
        interestRate: 12,
        duration: 12,
        durationUnit: DurationUnit.MONTHS,
        startDate: new Date(),
        dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      } as Loan,
      expectedPayments: 12,
      expectedFirstPayment: {
        paymentNumber: 1,
        principalAmount: 833.33,
        interestAmount: 100,
        totalPayment: 933.33,
        remainingBalance: 9166.67,
      },
      expectedLastPayment: {
        paymentNumber: 12,
        principalAmount: 833.33,
        interestAmount: 8.33,
        totalPayment: 841.67,
        remainingBalance: 0,
      },
    },
    {
      title: 'Standard case: 24 months, 10% interest, $20,000',
      loan: {
        id: 2,
        userId: 1,
        amount: 20000,
        interestRate: 10,
        duration: 24,
        durationUnit: DurationUnit.MONTHS,
        startDate: new Date(),
        dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      } as Loan,
      expectedPayments: 24,
      expectedFirstPayment: {
        paymentNumber: 1,
        principalAmount: 833.33,
        interestAmount: 166.67,
        totalPayment: 1000,
        remainingBalance: 19166.67,
      },
      expectedLastPayment: {
        paymentNumber: 24,
        principalAmount: 833.33,
        interestAmount: 6.94,
        totalPayment: 840.28,
        remainingBalance: 0,
      },
    },
    // // Edge case: Zero interest rate
    {
      title: 'Edge case: 12 months, 0% interest, $12,000',
      loan: {
        id: 3,
        userId: 1,
        amount: 12000,
        interestRate: 0,
        duration: 12,
        durationUnit: DurationUnit.MONTHS,
        startDate: new Date(),
        dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      } as Loan,
      expectedPayments: 12,
      expectedFirstPayment: {
        paymentNumber: 1,
        principalAmount: 1000,
        interestAmount: 0,
        totalPayment: 1000,
        remainingBalance: 11000,
      },
      expectedLastPayment: {
        paymentNumber: 12,
        principalAmount: 1000,
        interestAmount: 0,
        totalPayment: 1000,
        remainingBalance: 0,
      },
    },
    // Edge case: One payment (duration = 1)
    {
      title: 'Edge case: 1 month, 5% interest, $5,000',
      loan: {
        id: 4,
        userId: 1,
        amount: 5000,
        interestRate: 5,
        duration: 1,
        durationUnit: DurationUnit.MONTHS,
        startDate: new Date(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      } as Loan,
      expectedPayments: 1,
      expectedFirstPayment: {
        paymentNumber: 1,
        principalAmount: 5000,
        interestAmount: 20.83,
        totalPayment: 5020.83,
        remainingBalance: 0,
      },
      expectedLastPayment: {
        paymentNumber: 1,
        principalAmount: 5000,
        interestAmount: 20.83,
        totalPayment: 5020.83,
        remainingBalance: 0,
      },
    },
  ];

  describe.each(scenarios)('Amortization Scenarios', (scenario) => {
    it(
      'should calculate variable amortization correctly for: ' + scenario.title,
      () => {
        const loan: Loan = scenario.loan;
        const expectedFirstPayment = scenario.expectedFirstPayment;
        const expectedLastPayment = scenario.expectedLastPayment;

        const amortization = service.calculate(loan);
        expect(amortization.length).toBe(scenario.expectedPayments);

        // Check first payment
        const firstAmortization = amortization[0];
        expect(firstAmortization.paymentNumber).toBe(
          expectedFirstPayment.paymentNumber,
        );
        expect(firstAmortization.principalAmount).toBeCloseTo(
          expectedFirstPayment.principalAmount,
        );
        expect(firstAmortization.interestAmount).toBeCloseTo(
          expectedFirstPayment.interestAmount,
        );
        expect(firstAmortization.totalPayment).toBeCloseTo(
          expectedFirstPayment.totalPayment,
        );
        expect(firstAmortization.remainingBalance).toBeCloseTo(
          expectedFirstPayment.remainingBalance,
        );

        // Check last payment
        const lastAmortization = amortization[amortization.length - 1];
        expect(lastAmortization.paymentNumber).toBe(
          expectedLastPayment.paymentNumber,
        );
        expect(lastAmortization.principalAmount).toBeCloseTo(
          expectedLastPayment.principalAmount,
        );
        expect(lastAmortization.interestAmount).toBeCloseTo(
          expectedLastPayment.interestAmount,
        );
        expect(lastAmortization.totalPayment).toBeCloseTo(
          expectedLastPayment.totalPayment,
        );
        expect(lastAmortization.remainingBalance).toBeCloseTo(
          expectedLastPayment.remainingBalance,
        );
      },
    );
  });
});
