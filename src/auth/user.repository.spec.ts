import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

const mockCredentialsDTO = { username: 'Test User', password: '1234@maxxxHH' };

describe('User Repository', () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('Sign Up()', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it('should signs up a user', async () => {
      save.mockResolvedValue(true);

      expect(userRepository.SignUp(mockCredentialsDTO)).resolves.not.toThrow();
      const result = await userRepository.SignUp(mockCredentialsDTO);
      expect(result).toMatchObject({ username: 'Test User' });
    });

    it('should throw a conflict exeception if username exists already', () => {
      save.mockRejectedValue({ code: '23505' });

      expect(userRepository.SignUp(mockCredentialsDTO)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw a conflict exeception if username exists already', () => {
      save.mockRejectedValue({ code: 'ANY OTHER ERROR CODE' });

      expect(userRepository.SignUp(mockCredentialsDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('validateUserPassword()', () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = {
        username: mockCredentialsDTO.username,
        validatePassword: jest.fn(),
      };
    });

    it('should return the username in case of valid credentials ', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDTO,
      );
      expect(result).toEqual('Test User');
    });

    it('should return null in case of wrong username', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDTO,
      );
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null in case of wrong password', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDTO,
      );
      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
