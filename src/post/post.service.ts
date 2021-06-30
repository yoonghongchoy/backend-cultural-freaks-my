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
import { GetPostDto } from './dto/get-post.dto';
import { User } from '../user/schemas/user.schema';
import { SearchQueryDto } from '../search/dto/search-query.dto';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
  ) {}

  search(searchQueryDto: SearchQueryDto) {
    const { limit, offset, search } = searchQueryDto;

    return this.postModel
      .find({ content: { $regex: search, $options: 'i' } }, '_id content')
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  findAll(getPostDto: GetPostDto) {
    const { limit, offset, userId } = getPostDto;

    const filter = {};

    if (userId) {
      filter['user'] = userId;
    }

    this.logger.debug(`Filter: ${JSON.stringify(filter)}`);

    return this.postModel
      .find(filter)
      .populate('user', 'firstName surname profilePicture')
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string) {
    const post = await this.postModel
      .findOne({ _id: id })
      .populate('user', 'firstName surname profilePicture')
      .exec();
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }
    return post;
  }

  async create(createPostDto: CreatePostDto, user: User) {
    const { content, hashtags, medias } = createPostDto;

    let post = new this.postModel();
    post.user = user._id;
    post.content = content;
    post.hashtags = hashtags;
    post.medias = medias;

    try {
      await post.save();
    } catch (err) {
      this.logger.error(
        `Failed to create a post for user "${
          user.email
        }". Data: ${JSON.stringify(createPostDto)}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }

    post = <Post>post.toObject();
    delete post.user;

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

  like(postId: string, userId: string) {
    return this.postModel.updateOne(
      { _id: postId },
      { $push: { likes: userId } },
    );
  }

  unlike(postId: string, userId: string) {
    return this.postModel.updateOne(
      { _id: postId },
      { $pull: { likes: userId } },
    );
  }
}
