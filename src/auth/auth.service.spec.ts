import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        JwtModule.register({
          secret: 'mySecretKey',
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return auth payload object for valid credentials with JWT token', async () => {
      const authPayload = await service.signIn('testUser', 'testPass');

      expect(authPayload).toBeDefined();
      expect(authPayload?.access_token).toBeDefined();
    });

    it('should return UnauthorizedException for invalid credentials', async () => {
      await expect(service.signIn('testUser', 'wrongPass')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
