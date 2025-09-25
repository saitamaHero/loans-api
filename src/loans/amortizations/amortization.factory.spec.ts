import { Test, TestingModule } from '@nestjs/testing';
import { AmortizationFactory } from './amortization.factory';
import { AmortizationsModule } from './amortizations.module';
import { AmortizationType } from './interfaces';

describe('AmortizationFactory', () => {
  let factory: AmortizationFactory;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AmortizationsModule],
      providers: [AmortizationFactory],
    }).compile();

    factory = module.get<AmortizationFactory>(AmortizationFactory);
  });

  it('should be defined', () => {
    expect(factory).toBeDefined();
  });

  describe('createAmortizationService', () => {
    it('should throw an error for unsupported amortization type', () => {
      expect(() =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        factory.createAmortizationService('unsupported' as any),
      ).toThrow('Unsupported amortization type');
    });

    it('should return FixedAmortizationService for "fixed" type', () => {
      const service = factory.createAmortizationService(AmortizationType.FIXED);
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('FixedAmortizationService');
    });

    it('should return VariableAmortizationService for "variable" type', () => {
      const service = factory.createAmortizationService(
        AmortizationType.VARIABLE,
      );
      expect(service).toBeDefined();
      expect(service.constructor.name).toBe('VariableAmortizationService');
    });
  });
});
