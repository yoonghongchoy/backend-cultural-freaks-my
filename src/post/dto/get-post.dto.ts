import { IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetPostDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  offset: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  userId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword1: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword2: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  keyword3: string;
}
