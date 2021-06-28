import { IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  offset: number;

  @IsString()
  search: string;
}
