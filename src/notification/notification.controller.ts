import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetNotificationDto } from './dto/get-notification.dto';
import { User } from '../user/schemas/user.schema';
import { GetUser } from '../auth/get-user.decorator';
import { CreateNotificationDto } from './dto/create-notification.dto';

@ApiTags('notification')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  findAllByUser(
    @Query() getNotificationDto: GetNotificationDto,
    @GetUser() user: User,
  ) {
    return this.notificationService.findAllByUser(getNotificationDto, user);
  }

  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @GetUser() user: User,
  ) {
    this.notificationService.create(createNotificationDto, user);
  }
}
