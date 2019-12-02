import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';
import { UnauthorizedException } from '@nestjs/common';

const mockUserRepository = () => ({ findOne: jest.fn() });

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate()', () => {
    it('should validate and return a user if they exist', async () => {
      const user = { username: 'Test User' };

      userRepository.findOne.mockResolvedValue(user);

      const result = await jwtStrategy.validate(user);

      expect(userRepository.findOne).toHaveBeenCalledWith(user);
      expect(result).toMatchObject(user);
    });

    it('should throw unauthorized exception if user does not exist', async () => {
      const user = { username: 'Test User' };
      userRepository.findOne.mockResolvedValue(null);

      expect(jwtStrategy.validate(user)).rejects.toThrow(UnauthorizedException);
    });
  });
});
