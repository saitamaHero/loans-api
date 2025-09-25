import { Controller, Get, Param } from '@nestjs/common';
import { LoansService } from './loans.service';
import { Loan } from './entities/loan.entity';

@Controller('/api/v2.0/loan')
export class LoansControllerV2 {
  constructor(private readonly loansService: LoansService) {}

  @Get(':id')
  async getLoan(@Param('id') id: number): Promise<Loan | null> {
    const loan = await this.loansService.findLoanWithAmortizations(id);

    return loan;
  }
}
