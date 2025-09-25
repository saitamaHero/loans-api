import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService, JwtPayload } from './auth.service';
import { User } from 'src/users/users.service';
import { sign } from 'crypto';
// import { AuthModule } from './auth.module';
// import { UsersModule } from '../users/users.module';
// import { sign } from 'crypto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockUser = {
    id: 1,
    username: 'testuser',
    password: 'testpass',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      // imports: [AuthModule, UsersModule],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(async (user: Omit<User, 'id'>): Promise<User> => {
              return { id: 1, ...user } as User;
            }),
            signIn: jest.fn().mockResolvedValue({ access_token: 'testtoken' }),
            userFromPayload: jest.fn((payload: JwtPayload) => {
              if (payload.sub === mockUser.id) {
                return { ...mockUser };
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should register a new user', async () => {
      const newUserData = { username: 'newuser', password: 'newpass' };
      const expectedUser = { id: 1, ...newUserData };

      const user = await controller.signUp(newUserData);
      expect(service.signUp).toHaveBeenCalledWith(newUserData);
      expect(user).toEqual(expectedUser);
    });
  });

  describe('signIn', () => {
    it('should return an access token for valid credentials', async () => {
      const body = { username: 'testuser', password: 'testpass' };
      const result = await controller.signIn(body);

      await expect(service.signIn).toHaveBeenCalledWith(body.username, body.password);
      expect(result).toEqual({ access_token: 'testtoken' });
    });
  });

  describe('getUser', () => {
    it('getUser should return user from request', async () => {
      const req = {
        user: { username: mockUser.username, sub: mockUser.id } as JwtPayload,
      };
      const user = await controller.getUser(req);

      expect(service.userFromPayload).toHaveBeenCalledWith(req.user);
      expect(user).toEqual(mockUser);
    });

    it('getUser should return null if user not found', async () => {
      const req = {
        user: { username: 'unknown', sub: 999 } as JwtPayload,
      };
      const user = await controller.getUser(req);

      expect(service.userFromPayload).toHaveBeenCalledWith(req.user);
      expect(user).toBeNull();
    });
  });
});
