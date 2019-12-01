import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredetialsDTO } from './dto/auth-credential.dto';
import { BadRequestException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async SignUp(authCredetialsDTO: AuthCredetialsDTO): Promise<void> {
    const { username, password } = authCredetialsDTO;
    try {
      const user = new User();
      user.username = username;
      user.password = password;
      await user.save();
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Oops, User not created');
    }
  }
}
