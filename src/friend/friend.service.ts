import { Injectable, Logger } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Friend } from './schemas/friend.schemas';
import { Model } from 'mongoose';
import { User } from '../user/schemas/user.schema';
import { PaginationQueryDto } from './dto/pagination-query.dto';

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

  findAllById(paginationQuery: PaginationQueryDto, user: User) {
    const { limit, offset } = paginationQuery;
    const { _id: id } = user;

    return this.friendModal
      .find({ $or: [{ user1: id }, { user2: id }] })
      .populate('user1 user2', 'firstName surname profilePicture')
      .skip(offset)
      .limit(limit)
      .exec();
  }
}
