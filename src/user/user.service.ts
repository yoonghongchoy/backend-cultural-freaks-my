import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchQueryDto } from '../search/dto/search-query.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto, token: string) {
    const user = new this.userModel(createUserDto);
    user.token = token;
    return user.save();
  }

  search(searchQueryDto: SearchQueryDto, userId: string) {
    const { limit, offset, search } = searchQueryDto;

    return this.userModel
      .find(
        {
          $or: [
            { firstName: { $regex: search, $options: 'i' } },
            { surname: { $regex: search, $options: 'i' } },
          ],
          isActivated: true,
          _id: { $ne: userId },
        },
        '_id profilePicture firstName surname',
      )
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  findOneById(id: string) {
    return this.userModel.findOne({ _id: id }).exec();
  }

  async updateIsActivated(token: string) {
    const existingUser = await this.userModel.findOneAndUpdate(
      { token },
      { isActivated: true, token: null },
    );

    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return existingUser;
  }
}
