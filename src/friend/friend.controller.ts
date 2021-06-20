import { Controller, Get, Post, Body, UseGuards, Query } from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../user/schemas/user.schema';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaginationQueryDto } from '../post/dto/pagination-query.dto';

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
  findAll(@Query() paginationQuery: PaginationQueryDto, @GetUser() user: User) {
    return this.friendService.findAllById(paginationQuery, user);
  }
}
