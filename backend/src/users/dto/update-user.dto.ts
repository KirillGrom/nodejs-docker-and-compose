import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;
  @IsOptional()
  @IsString()
  about?: string;
  @IsOptional()
  @IsString()
  avatar?: string;
  @IsOptional()
  @IsEmail()
  email?: string;
  @IsOptional()
  @IsString()
  password?: string;
}
