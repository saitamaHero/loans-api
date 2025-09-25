import { Injectable } from '@nestjs/common';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class HashService {
  private readonly saltRounds = 12;

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
