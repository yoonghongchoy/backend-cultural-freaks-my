import { IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class AddCommentDto {
  @IsString()
  post: string;

  @IsPositive()
  level: number;

  @IsString()
  comment: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  parentComment: string;
}
