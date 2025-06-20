import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
export class CreateWishDto {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsString()
  @IsNotEmpty()
  link: string;
  @IsString()
  @IsNotEmpty()
  image: string;
  @IsNumber()
  @IsNotEmpty()
  price: number;
  @IsString()
  @IsNotEmpty()
  description: string;
}