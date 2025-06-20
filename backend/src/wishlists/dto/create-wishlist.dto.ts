import { IsNumber, IsString } from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  name: string;
  @IsString()
  image: string;
  @IsNumber({}, { each: true })
  itemsId: number[];
}
