import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notification.schema';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { User } from '../user/schemas/user.schema';
import { GetNotificationDto } from './dto/get-notification.dto';

@Injectable()
export class NotificationService {
  private logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,
  ) {}

  create(createNotificationDto: CreateNotificationDto, user: User) {
    const notification = new this.notificationModel();
    notification.notifier = createNotificationDto.notifier;
    notification.sender = user._id;
    notification.content = createNotificationDto.content;

    return notification.save();
  }

  findAllByUser(getNotificationDto: GetNotificationDto, user: User) {
    const { limit, offset } = getNotificationDto;

    return this.notificationModel
      .find({ notifier: user._id })
      .populate('sender', 'profilePicture firstName surname')
      .limit(limit)
      .skip(offset)
      .exec();
  }
}
