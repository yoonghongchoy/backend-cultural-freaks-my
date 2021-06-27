import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';

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
