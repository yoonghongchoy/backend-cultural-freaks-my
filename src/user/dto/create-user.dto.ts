import {
  IsDate,
  IsDateString,
  IsEmail,
  IsIn,
  IsISO8601,
  IsString,
} from 'class-validator';
import { Gender } from '../schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  surName: string;

  @IsString()
  dob: string;

  @IsIn([Gender.male, Gender.female, Gender.custom])
  gender: Gender;
}
