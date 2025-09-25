import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HashingModule } from 'src/auth/hashing/hashing.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashingModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
