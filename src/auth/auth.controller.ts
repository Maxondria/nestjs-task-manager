import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredetialsDTO } from './dto/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async SignUp(
    @Body(ValidationPipe) authCredetialsDTO: AuthCredetialsDTO,
  ): Promise<{
    username: string;
  }> {
    return await this.authService.SignUp(authCredetialsDTO);
  }

  @Post('/login')
  async SignIn(
    @Body(ValidationPipe) authCredetialsDTO: AuthCredetialsDTO,
  ): Promise<{
    accessToken: string;
    username: string;
  }> {
    return await this.authService.SignIn(authCredetialsDTO);
  }
}
