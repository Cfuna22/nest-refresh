import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class registerDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}
