import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  @IsNumber()
  amount!: number;
  @IsOptional()
  @IsBoolean()
  hidden?: boolean;
  @IsNotEmpty()
  @IsNumber()
  itemId!: number;
}
