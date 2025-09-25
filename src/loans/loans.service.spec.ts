import { Test, TestingModule } from '@nestjs/testing';
import { DurationUnit, LoansService } from './loans.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AmortizationsModule } from './amortizations/amortizations.module';

describe('LoansService', () => {
  let service: LoansService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, AmortizationsModule],
      providers: [LoansService],
    }).compile();

    service = module.get<LoansService>(LoansService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('loan registration', () => {
    it('should register a loan successfully', async () => {
      const user = await usersService.signUp({
        username: 'loanUser',
        password: 'loanPass',
      });

      const loanData = {
        userId: user.id,
        amount: 10000,
        interestRate: 5.0,
        duration: 36,
        durationUnit: DurationUnit.MONTHS,
        startDate: new Date(),
        dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      };

      const result = await service.registerLoan(loanData);
      expect(result).toHaveProperty('id');
      expect(result.amount).toBe(10000);
      expect(result.interestRate).toBe(5.0);
      expect(result.duration).toBe(36);
      expect(result.durationUnit).toBe(DurationUnit.MONTHS);
      expect(result.userId).toBe(user.id);
    });

    it('should throw and error if invalid user ID is provided', async () => {
      const loanData = {
        userId: 999,
        amount: 10000,
        interestRate: 5.0,
        duration: 36,
        durationUnit: DurationUnit.MONTHS,
        startDate: new Date(),
        dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      };

      await expect(service.registerLoan(loanData)).rejects.toThrow(
        'Invalid user ID',
      );
    });

    it('should throw an error if negative amount is provided', async () => {
      const loanData = {
        userId: 1,
        amount: -5000,
        interestRate: 5.0,
        duration: 36,
        durationUnit: DurationUnit.MONTHS,
        startDate: new Date(),
        dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      };

      await expect(service.registerLoan(loanData)).rejects.toThrow(
        'Loan amount must be positive',
      );
    });

    it('should throw an error if interest rate is out of bounds', async () => {
      const loanData = {
        userId: 1,
        amount: 10000,
        interestRate: 150.0,
        duration: 36,
        durationUnit: DurationUnit.MONTHS,
        startDate: new Date(),
        dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      };

      await expect(service.registerLoan(loanData)).rejects.toThrow(
        'Interest rate must be between 0 and 100',
      );
    });

    it('should throw an error if amount is zero', async () => {
      const user = await usersService.signUp({
        username: 'zeroAmountUser',
        password: 'zeroPass',
      });
      const loanData = {
        userId: user.id,
        amount: 0,
        interestRate: 5.0,
        duration: 36,
        durationUnit: DurationUnit.MONTHS,
        startDate: new Date(),
        dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 2)),
      };

      await expect(service.registerLoan(loanData)).rejects.toThrow(
        'Loan amount must be positive',
      );
    });
  });
});
