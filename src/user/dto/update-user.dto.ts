import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { Gender } from '../schemas/user.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  surname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dob: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([Gender.male, Gender.female, Gender.custom])
  gender: Gender;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profilePicture: string;
}
