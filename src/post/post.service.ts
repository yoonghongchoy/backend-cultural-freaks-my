import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/post.schema';
import { Model, Schema } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostDto } from './dto/get-post.dto';
import { User } from '../user/schemas/user.schema';
import { SearchQueryDto } from '../search/dto/search-query.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comments } from './schemas/comment.schema';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comments.name)
    private readonly commentModel: Model<Comments>,
  ) {}

  search(searchQueryDto: SearchQueryDto) {
    const { limit, offset, search } = searchQueryDto;

    return this.postModel
      .find(
        {
          $or: [
            { content: { $regex: search, $options: 'i' } },
            { hashtags: { $regex: search, $options: 'i' } },
          ],
        },
        '_id content',
      )
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
  }

  findAll(getPostDto: GetPostDto, myId: string) {
    const {
      limit,
      offset,
      sortBy,
      userId,
      state,
      keyword1,
      keyword2,
      keyword3,
    } = getPostDto;
    this.logger.debug(JSON.stringify(getPostDto));
    const filter = {};
    const sort = { createdAt: -1 };

    if (userId) {
      filter['user'] = userId;
    }

    if (sortBy === 'isLiked') {
      filter['likes'] = myId;
    } else if (sortBy === 'popular') {
      sort['likes'] = -1;
    }

    if (state) {
      filter['hashtags'] = `#${state.replace(/\s+/g, '')}`;
    }

    if (keyword1) {
      filter['hashtags'] = `#${keyword1.replace(/\s+/g, '')}`;
    }

    if (keyword2) {
      filter['hashtags'] = `#${keyword2.replace(/\s+/g, '')}`;
    }

    if (keyword3) {
      filter['hashtags'] = `#${keyword3.replace(/\s+/g, '')}`;
    }

    this.logger.debug(`Filter: ${JSON.stringify(filter)}`);
    this.logger.debug(`Sort: ${JSON.stringify(sort)}`);

    return this.postModel
      .find(filter)
      .populate({ path: 'user', select: 'firstName surname profilePicture' })
      .populate({
        path: 'originalPost',
        populate: { path: 'user', select: 'firstName surname profilePicture' },
      })
      .populate({
        path: 'comments',
        populate: {
          path: 'subComments user',
          select: 'firstName surname profilePicture',
        },
      })
      .skip(offset)
      .limit(limit)
      .sort(sort)
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

  async share(postId: string, userId: string) {
    const post = await this.postModel.findOne({ _id: postId });

    if (!post) {
      throw new InternalServerErrorException();
    }

    const newPost = new this.postModel();
    newPost.user = userId;
    newPost.originalPost = post.originalPost ? post.originalPost : post._id;

    return newPost.save();
  }

  async addComment(addCommentDto: AddCommentDto, user: User) {
    const comment = new this.commentModel();
    comment.comment = addCommentDto.comment;
    comment.level = addCommentDto.level;
    comment.user = user._id;
    const newComment = await comment.save();

    if (addCommentDto.level === 2 && addCommentDto.parentComment) {
      await this.commentModel.updateOne(
        { _id: addCommentDto.parentComment },
        { $push: { subComments: newComment._id } },
      );
    } else if (addCommentDto.level === 1) {
      await this.postModel.updateOne(
        { _id: addCommentDto.post },
        { $push: { comments: newComment._id } },
      );
    }

    return newComment;
  }
}
