import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe('User Entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.salt = 'test salt';
    user.password = 'test password';
    bcrypt.hash = jest.fn();
  });
  describe('validatePassword()', () => {
    it('should return true if password is valid', async () => {
      bcrypt.hash.mockResolvedValue(user.password);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword(user.password);
      expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
      expect(result).toBe(true);
    });

    it('should return false if password is not valid', async () => {
      bcrypt.hash.mockResolvedValue('wrong password');

      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrong password');
      expect(bcrypt.hash).toHaveBeenCalledWith('wrong password', user.salt);
      expect(result).toBe(false);
    });
  });
});
