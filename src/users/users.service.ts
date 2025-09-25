import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { HashService } from 'src/auth/hashing/hash.service';

/**
 * User interface
 *
 * @export
 * @interface User
 * @typedef {User}
 */
export interface User2 {
  id: number;
  username: string;
  password: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async findOne(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async signUp(user: CreateUserDto): Promise<User> {
    const foundUser = await this.findOne(user.username);

    if (foundUser) {
      throw new BadRequestException('Username already exists');
    }

    const newUser = this.usersRepository.create({
      username: user.username,
      password: await this.hashService.hashPassword(user.password),
    });

    return await this.usersRepository.save(newUser);
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
