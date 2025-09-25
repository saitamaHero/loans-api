import { Loan } from 'src/loans/entities/loan.entity';
import { AmortizationStatus } from 'src/loans/enums';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('amortizations')
export class Amortization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  paymentNumber: number;

  // Uncomment if you want to store payment date
  // @Column({ type: 'date', nullable: true })
  // paymentDate: Date;

  @Column({
    type: 'enum',
    enum: AmortizationStatus,
    default: AmortizationStatus.PENDING,
  })
  status: AmortizationStatus;

  @Column('decimal', { precision: 15, scale: 2 })
  principalAmount: number;

  @Column('decimal', { precision: 15, scale: 2 })
  interestAmount: number;

  @Column('decimal', { precision: 15, scale: 2 })
  totalPayment: number;

  @Column('decimal', { precision: 15, scale: 2 })
  remainingBalance: number;

  @ManyToOne(() => Loan, (loan) => loan.amortizations)
  loan: Loan;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
