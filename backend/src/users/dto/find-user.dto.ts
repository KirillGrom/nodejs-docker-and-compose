import {
  isEmail,
  isString,
  IsString,
  Validate,
  ValidatorConstraintInterface,
} from 'class-validator';

export class QueryValidation implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    return isEmail(value) || isString(value);
  }
}
export class FindUserDto {
  @IsString()
  @Validate(QueryValidation)
  query: string;
}
