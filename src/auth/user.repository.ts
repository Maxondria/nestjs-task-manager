import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredetialsDTO } from './dto/auth-credential.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async SignUp(
    authCredetialsDTO: AuthCredetialsDTO,
  ): Promise<{
    username: string;
  }> {
    const { username, password } = authCredetialsDTO;
    const user = new User();

    user.salt = await bcrypt.genSalt();
    user.username = username;
    user.password = await this.hashPassword(user.salt, password);

    try {
      await user.save();
      return { username };
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      }
      throw new InternalServerErrorException();
    }
  }

  async validateUserPassword(
    authCredetialsDTO: AuthCredetialsDTO,
  ): Promise<string> {
    const { username, password } = authCredetialsDTO;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    } else return null;
  }

  private async hashPassword(salt: string, password: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
