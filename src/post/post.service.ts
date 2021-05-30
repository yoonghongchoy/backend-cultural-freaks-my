import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.postModel
      .find()
      .populate('user', 'firstName surname')
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async findOne(id: string) {
    const post = await this.postModel
      .findOne({ _id: id })
      .populate('user', 'firstName surname')
      .exec();
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async create(createPostDto: CreatePostDto, user: User) {
    const { content, hashtags, images, videos } = createPostDto;

    let post = new this.postModel();
    post.user = user;
    post.content = content;
    post.hashtags = hashtags;
    post.images = images;
    post.videos = videos;

    try {
      await post.save();
    } catch (err) {
      this.logger.error(
        `Failed to create a task for user "${
          user.email
        }". Data: ${JSON.stringify(createPostDto)}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }

    post = <Post>post.toObject();
    delete post.user.password;

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    const existingPost = await this.postModel
      .findOneAndUpdate({ _id: id }, { $set: updatePostDto }, { new: true })
      .exec();

    if (!existingPost) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return existingPost;
  }

  async remove(id: string) {
    const post = await this.findOne(id);
    return post.remove();
  }
}
