import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PaymentType } from '../enums';
import { Loan } from './loan.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Loan, (loan) => loan.payments)
  loan: Loan;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  paymentDate: Date;

  @Column({ type: 'enum', enum: PaymentType })
  paymentType: PaymentType;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
