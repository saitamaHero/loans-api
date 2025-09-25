import { Test, TestingModule } from '@nestjs/testing';
import { AmortizationsModule } from './amortizations.module';
import { AmortizationService } from './amortizations.service';

describe('AmortizationService', () => {
  let service: AmortizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AmortizationsModule],
      providers: [AmortizationService],
    }).compile();

    service = module.get<AmortizationService>(AmortizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
