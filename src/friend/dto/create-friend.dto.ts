import { IsObject, IsString } from 'class-validator';

export class CreateFriendDto {
  @IsString()
  userId: string;
}
