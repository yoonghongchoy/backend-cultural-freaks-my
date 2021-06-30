import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class GetNotificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  limit: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  offset: number;
}
