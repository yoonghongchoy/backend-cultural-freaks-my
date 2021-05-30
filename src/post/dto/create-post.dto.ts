import { IsObject, IsOptional, IsString } from 'class-validator';
import { User } from '../../user/schemas/user.schema';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  hashtags: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  images: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  videos: string[];
}
