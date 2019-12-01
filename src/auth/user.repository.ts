import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredetialsDTO } from './dto/auth-credential.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async SignUp(
    authCredetialsDTO: AuthCredetialsDTO,
  ): Promise<{
    username: string;
  }> {
    const { username, password } = authCredetialsDTO;
    const user = new User();
    user.username = username;
    user.password = password;

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
}
