import { IsNotEmpty, IsString, Min } from 'class-validator';

export class SinginDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  @Min(2)
  password: string;
}
