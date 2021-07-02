import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @IsString()
  notifier: string;

  @IsString()
  content: string;

  @IsString()
  post: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment: string;
}
