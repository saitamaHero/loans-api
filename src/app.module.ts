import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Amortization } from './loans/amortizations/entities/amortization.entity';
import { Loan } from './loans/entities/loan.entity';
import { Payment } from './loans/entities/payment.entity';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    LoansModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'dionicio',
      password: '',
      database: 'loans_test',
      entities: [User, Loan, Amortization, Payment],
      synchronize: true, // Set to false in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
