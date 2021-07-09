import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostDto } from './dto/get-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../user/schemas/user.schema';
import { AddCommentDto } from './dto/add-comment.dto';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('post')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: any,
    @GetUser() user: User,
  ) {
    return this.postService.create(createPostDto, user, files);
  }

  @Get()
  findAll(@Query() getPostDto: GetPostDto, @GetUser() user: User) {
    return this.postService.findAll(getPostDto, user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
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
