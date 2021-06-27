import { IsString } from 'class-validator';

export class UpdateFriendDto {
  @IsString()
  id: string;

  @IsString()
  status: string;
}
