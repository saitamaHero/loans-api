import { Test, TestingModule } from '@nestjs/testing';
import { LoansController } from './loans.controller';
import { Loan, LoansService } from './loans.service';

describe('LoansController', () => {
  let controller: LoansController;
  let loansService: LoansService;

  const mockedLoans = [
    {
      id: 1,
      userId: 1,
      amount: 1000,
      interestRate: 5,
      duration: 12,
      durationUnit: 'months',
      startDate: new Date(),
      dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoansController],
      providers: [
        {
          provide: LoansService,
          useValue: {
            registerLoan: jest.fn(async (loanData: Omit<Loan, 'id'>) =>
              Promise.resolve({ id: 1, ...loanData }),
            ),
            findAll: jest.fn(async () => Promise.resolve(mockedLoans)),
            findById: jest.fn(async (id: number) =>
              Promise.resolve(
                mockedLoans.find((loan) => loan.id === id) || null,
              ),
            ),
          },
        },
      ],
    }).compile();

    controller = module.get<LoansController>(LoansController);
    loansService = module.get<LoansService>(LoansService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('loan registration', () => {
    it('should register a loan successfully', async () => {
      const loanData = {
        //mock all data
        userId: 1,
        amount: 1000,
        interestRate: 5,
        duration: 12,
        durationUnit: 'months',
        startDate: new Date(),
        dueDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        amortizationType: 'fixed',
      } as Omit<Loan, 'id'>;

      const result = await controller.registerLoan(loanData);

      expect(result).toEqual({
        loanId: expect.any(Number),
        status: 'registered',
      });
      // expect(result).toHaveProperty('loanId');
      // expect(result).toHaveProperty('status', 'registered');
    });

    it('should fail to register a loan with invalid data', async () => {
      const error = new Error('Loan amount must be positive');
      (loansService.registerLoan as jest.Mock).mockRejectedValueOnce(error);

      const loanData = {
        userId: 1,
        amount: -100,
        interestRate: 5,
        duration: 12,
        durationUnit: 'months',
        startDate: new Date(),
        dueDate: new Date(),
        amortizationType: 'fixed',
      } as Omit<Loan, 'id'>;

      // Act & Assert
      await expect(controller.registerLoan(loanData)).rejects.toThrow(
        'Loan amount must be positive',
      );
    });
  });

  describe('get loans', () => {
    it('should return a list of loans', async () => {
      const result = await controller.getLoans();

      expect(result).toEqual(mockedLoans);
    });

    it('should return an empty list when no loans are found', async () => {
      (loansService.findAll as jest.Mock).mockResolvedValueOnce([]);

      const result = await controller.getLoans();

      expect(result).toEqual([]);
    });
  });

  describe('get loan by id', () => {
    it('should return a loan by id', async () => {
      const loanId = mockedLoans[0].id;

      const result = await controller.getLoan(loanId);

      expect(result).toEqual(mockedLoans[0]);
    });

    it('should return null if loan not found', async () => {
      const loanId = 999;

      (loansService.findById as jest.Mock).mockResolvedValueOnce(null);

      const result = await controller.getLoan(loanId);

      expect(result).toBeNull();
    });
  });

  // describe('loan amortization', () => {
  //   it('should calculate amortization schedule', async () => {
  //     const loanId = mockedLoans[0].id;
  //     const result = await controller.getAmortizationSchedule(loanId);
  //     expect(result).toEqual(expect.any(Array));
  //   });
  // });
});
