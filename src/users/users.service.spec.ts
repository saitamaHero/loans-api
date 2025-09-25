import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by username', async () => {
    const user = await service.findOne('testUser');
    expect(user).toBeDefined();
    expect(user?.username).toBe('testUser');
  });

  it('should return null for a non-existing user', async () => {
    const user = await service.findOne('nonExistingUser');
    expect(user).toBeNull();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const user = await service.signUp({
        username: 'newUser',
        password: 'newPass',
      });
      expect(user).toBeDefined();
      expect(user?.username).toBe('newUser');
    });

    it('should throw an error when registering an existing user', async () => {
      await service.signUp({ username: 'dummy', password: 'testPass' });

      await expect(
        service.signUp({ username: 'dummy', password: 'testPass' }),
      ).rejects.toThrow('User already exists');
    });
  });

  describe('search', () => {
    it('should find user by username', async () => {
      const newUser = await service.signUp({
        username: 'testUser99',
        password: 'testPass',
      });
      const user = await service.findOne(newUser.username);
      expect(user).toBeDefined();
      expect(user?.username).toBe(newUser.username);
    });

    it('should find user by id', async () => {
      const newUser = await service.signUp({
        username: 'testUser99',
        password: 'testPass',
      });
      const user = await service.findById(newUser.id);
      expect(user).toBeDefined();
      expect(user?.id).toBe(newUser.id);
    });
  });
});
