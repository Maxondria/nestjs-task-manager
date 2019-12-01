import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredetialsDTO } from './dto/auth-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async SignUp(authCredetialsDTO: AuthCredetialsDTO): Promise<void> {
    return this.userRepository.SignUp(authCredetialsDTO);
  }
}
