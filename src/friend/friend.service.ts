import { Injectable, Logger } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from './schemas/friend.schemas';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { GetFriendDto } from './dto/get-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';

@Injectable()
export class FriendService {
  private logger = new Logger(FriendService.name);

  constructor(
    @InjectModel(Friend.name) private readonly friendModal: Model<Friend>,
  ) {}

  create(createFriendDto: CreateFriendDto, user: User) {
    const { userId } = createFriendDto;

    const newFriend = new this.friendModal();
    newFriend.user1 = user._id;
    newFriend.user2 = userId;

    return newFriend.save();
  }

  findAllByIdAndStatus(getFriendDto: GetFriendDto) {
    const { limit, offset, userId, status } = getFriendDto;
    let filter = {};

    if (status === 'pending') {
      filter = { user2: userId, status: status };
    } else {
      filter = { $or: [{ user1: userId }, { user2: userId }], status: status };
    }

    return this.friendModal
      .find(filter)
      .populate('user1 user2', 'firstName surname profilePicture')
      .skip(offset)
      .limit(limit)
      .exec();
  }

  checkIsFriend(userId: string, user: User) {
    const id = user._id;
    return this.friendModal
      .findOne(
        {
          $or: [
            { $and: [{ user1: id }, { user2: userId }] },
            { $and: [{ user1: userId }, { user2: id }] },
          ],
        },
        'status',
      )
      .exec();
  }

  updateFriendRequest(updateFriendDto: UpdateFriendDto) {
    const { id, status } = updateFriendDto;
    return this.friendModal.updateOne({ _id: id }, { status });
  }

  async remove(id: string) {
    const friend = await this.friendModal.findOne({ _id: id }).exec();
    return friend.remove();
  }
}
