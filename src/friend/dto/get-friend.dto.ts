import { IsOptional, IsPositive, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetFriendDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  offset: number;

  @IsString()
  userId: string;

  @IsString()
  status: string;
}
