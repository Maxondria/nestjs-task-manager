import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredetialsDTO } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './auth-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async SignUp(
    authCredetialsDTO: AuthCredetialsDTO,
  ): Promise<{
    username: string;
  }> {
    return this.userRepository.SignUp(authCredetialsDTO);
  }

  async SignIn(
    authCredetialsDTO: AuthCredetialsDTO,
  ): Promise<{
    accessToken: string;
    username: string;
  }> {
    const username = await this.userRepository.validateUserPassword(
      authCredetialsDTO,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken, username };
  }
}
