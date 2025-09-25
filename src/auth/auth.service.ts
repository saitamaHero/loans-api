import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User2 as User, UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { HashService } from './hashing/hash.service';

export interface AuthPayload {
  access_token: string;
}

export interface JwtPayload {
  username: string;
  sub: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) {}

  async signUp(user: CreateUserDto): Promise<User> {
    const newUser = await this.usersService.signUp(user);

    return newUser;
  }

  async signIn(username: string, pass: string): Promise<AuthPayload> {
    const user = await this.usersService.findOne(username);

    if (
      !user ||
      !(await this.hashService.comparePasswords(pass, user.password))
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id } as JwtPayload;

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async userFromPayload(payload: JwtPayload): Promise<User | null> {
    const user = await this.usersService.findOne(payload.username);
    return Promise.resolve(user || null);
  }
}
