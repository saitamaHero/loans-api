import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { DurationUnit, LoanStatus } from '../enums';
import { AmortizationType } from '../amortizations/interfaces';
import { Amortization } from '../amortizations/entities/amortization.entity';
import { Payment } from './payment.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.loans)
  user: User;

  @Column('decimal')
  amount: number;

  @Column('decimal')
  interestRate: number;

  @Column()
  duration: number;

  @Column({ type: 'enum', enum: DurationUnit, default: DurationUnit.MONTHS })
  durationUnit: DurationUnit;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: AmortizationType,
    nullable: false,
    default: AmortizationType.FIXED,
  })
  amortizationType?: AmortizationType;

  @Column({
    type: 'enum',
    enum: LoanStatus,
  })
  status: LoanStatus;

  @OneToMany(() => Amortization, (amortization) => amortization.loan)
  amortizations: Amortization[];

  @OneToMany(() => Payment, (payment) => payment.loan)
  payments: Payment[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
