import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class AuthCredetialsDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}
