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
  userId: string;
}
