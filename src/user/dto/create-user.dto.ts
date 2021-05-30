import { IsEmail, IsIn, IsString } from 'class-validator';
import { Gender } from '../schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  surname: string;

  @IsString()
  dob: string;

  @IsIn([Gender.male, Gender.female, Gender.custom])
  gender: Gender;
}
