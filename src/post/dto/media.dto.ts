import { IsString } from 'class-validator';

export class MediaDto {
  @IsString()
  name: string;

  @IsString()
  value: string;

  @IsString()
  type: string;
}
