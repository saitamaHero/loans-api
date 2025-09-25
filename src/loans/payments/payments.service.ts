import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { Repository } from 'typeorm';
import { Loan } from '../entities/loan.entity';
import { PaymentType } from '../enums';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
  ) {}

  async makePayment(
    loanId: number,
    amount: number,
    type: PaymentType = PaymentType.NORMAL,
    paymentDate: Date = new Date(),
  ): Promise<Payment> {
    if (amount <= 0) {
      throw new Error('Payment amount must be positive');
    }

    const payment = this.paymentsRepository.create({
      loan: { id: loanId } as Loan,
      amount,
      paymentDate,
      paymentType: type,
    });

    return await this.paymentsRepository.save(payment);
  }
}
