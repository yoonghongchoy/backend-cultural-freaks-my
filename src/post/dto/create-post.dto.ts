import {
  IsArray,
  IsJSON,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Media } from '../schemas/post.schema';
import { Type } from 'class-transformer';
import { MediaDto } from './media.dto';

export class CreatePostDto {
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString({ each: true })
  hashtags: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  medias: MediaDto[];
}
