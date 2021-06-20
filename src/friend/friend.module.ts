import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { Friend, FriendSchema } from './schemas/friend.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Friend.name,
        schema: FriendSchema,
      },
    ]),
    AuthModule,
  ],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
