import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostDto } from './dto/get-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../user/schemas/user.schema';
import { AddCommentDto } from './dto/add-comment.dto';

@ApiTags('post')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  findAll(@Query() getPostDto: GetPostDto, @GetUser() user: User) {
    return this.postService.findAll(getPostDto, user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Post()
  create(@Body() createPostDto: CreatePostDto, @GetUser() user: User) {
    return this.postService.create(createPostDto, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }

  @Get('like/:postId')
  likePost(@Param('postId') postId: string, @GetUser() user: User) {
    return this.postService.like(postId, user._id);
  }

  @Delete('unlike/:postId')
  unlikePost(@Param('postId') postId: string, @GetUser() user: User) {
    return this.postService.unlike(postId, user._id);
  }

  @Get('share/:postId')
  sharePost(@Param('postId') postId: string, @GetUser() user: User) {
    return this.postService.share(postId, user._id);
  }

  @Post('comment')
  addComment(@Body() addCommentDto: AddCommentDto, @GetUser() user: User) {
    return this.postService.addComment(addCommentDto, user);
  }

  @Get('/comment/:postId')
  getComment(@Param('postId') postId: string) {
    return this.postService.getComment(postId);
  }

  @Delete('/comment/:postId')
  deleteComment(@Param('postId') postId: string) {
    return this.postService.deleteComment(postId);
  }
}
