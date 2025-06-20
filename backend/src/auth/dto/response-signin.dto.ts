import { IsString } from 'class-validator';

export class ResponseSigninDto {
  @IsString()
  access_token: string;
}
