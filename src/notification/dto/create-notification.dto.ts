import { IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  notifier: string;

  @IsString()
  content: string;

  @IsString()
  post: string;
}
