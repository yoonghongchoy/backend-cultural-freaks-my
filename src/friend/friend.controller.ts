import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Query,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../user/schemas/user.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { GetFriendDto } from './dto/get-friend.dto';

@ApiTags('friend')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  create(@Body() createFriendDto: CreateFriendDto, @GetUser() user: User) {
    return this.friendService.create(createFriendDto, user);
  }

  @Get()
  findByUserIdAndStatus(@Query() getFriendDto: GetFriendDto) {
    return this.friendService.findAllByIdAndStatus(getFriendDto);
  }

  @Get('isFriend/:userId')
  checkIsFriend(@Param('userId') userId: string, @GetUser() user: User) {
    return this.friendService.checkIsFriend(userId, user);
  }

  @Patch('updateFriendRequest')
  updateFriendRequest(@Body() updateFriendDto: UpdateFriendDto) {
    return this.friendService.updateFriendRequest(updateFriendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.friendService.remove(id);
  }
}
