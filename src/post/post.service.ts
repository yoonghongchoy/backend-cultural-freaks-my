import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Media, Post } from './schemas/post.schema';
import { Model } from 'mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetPostDto } from './dto/get-post.dto';
import { User } from '../user/schemas/user.schema';
import { SearchQueryDto } from '../search/dto/search-query.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { Comments } from './schemas/comment.schema';
import { FileService } from '../file/file.service';

@Injectable()
export class PostService {
  private logger = new Logger(PostService.name);

  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(Comments.name)
    private readonly commentModel: Model<Comments>,
    private fileService: FileService,
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

  async findAll(getPostDto: GetPostDto, myId: string) {
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
    let sort: any = { createdAt: -1 };
    const hashtags = [];

    if (userId) {
      filter['user'] = userId;
    }

    if (sortBy === 'isLiked') {
      filter['likes'] = myId;
    } else if (sortBy === 'popular') {
      sort = { likes: -1 };
    }

    if (state) {
      hashtags.push(`#${state.replace(/\s+/g, '')}`);
    }

    if (keyword1) {
      hashtags.push(`#${keyword1.replace(/\s+/g, '')}`);
    }

    if (keyword2) {
      hashtags.push(`#${keyword2.replace(/\s+/g, '')}`);
    }

    if (keyword3) {
      hashtags.push(`#${keyword3.replace(/\s+/g, '')}`);
    }

    if (hashtags.length > 0) {
      filter['hashtags'] = { $all: hashtags };
    }

    this.logger.debug(`Filter: ${JSON.stringify(filter)}`);
    this.logger.debug(`Sort: ${JSON.stringify(sort)}`);

    const posts = await this.postModel
      .find(filter)
      .populate({ path: 'user', select: 'firstName surname profilePicture' })
      .populate({
        path: 'originalPost',
        populate: { path: 'user', select: 'firstName surname profilePicture' },
      })
      .skip(offset)
      .limit(limit)
      .sort(sort)
      .lean()
      .exec();
    const newPosts = [];
    for (const post of posts) {
      const newPost = post;
      const newMedias = [];
      for (const media of post.medias) {
        const base64 = await this.fileService.getBase64(media.value);
        newMedias.push({
          name: media.name,
          type: media.type,
          value: base64,
        });
      }
      newPost.medias = newMedias;
      newPosts.push(newPost);
    }

    return newPosts;
  }

  async findOne(id: string, base64 = true) {
    const post = await this.postModel
      .findOne({ _id: id })
      .populate({ path: 'user', select: 'firstName surname profilePicture' })
      .populate({
        path: 'originalPost',
        populate: { path: 'user', select: 'firstName surname profilePicture' },
      })
      .exec();
    if (!post) {
      throw new NotFoundException(`Post #${id} not found`);
    }

    if (base64) {
      const newMedias = [];
      for (const media of post.medias) {
        const base64 = await this.fileService.getBase64(media.value);
        newMedias.push({
          name: media.name,
          type: media.type,
          value: base64,
        });
      }
      post.medias = newMedias;
    }

    return post;
  }

  async create(createPostDto: CreatePostDto, user: User, files: any) {
    const { content, hashtags } = createPostDto;
    const mediaFiles = [];

    if (!files) {
      throw new BadRequestException('Please upload at least 1 image/video');
    }

    files.forEach((file) => {
      const newMedia: Media = {
        name: file.originalname,
        value: file.id,
        type: file.mimetype.includes('video') ? 'video' : 'image',
      };
      mediaFiles.push(newMedia);
    });

    let post = new this.postModel();
    post.user = user._id;
    post.content = content;
    post.hashtags = hashtags;
    post.medias = mediaFiles;

    try {
      await post.save();
    } catch (err) {
      this.logger.error(
        `Failed to create a post for user "${user.email}". Data: ${createPostDto.content}`,
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
    const post = await this.findOne(id, false);

    if (post) {
      for (const media of post.medias) {
        await this.fileService.deleteFile(media.value);
      }
    }

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
    comment.post = addCommentDto.post;
    const newComment = await (await comment.save())
      .populate('subComments')
      .populate('user', 'firstName surname profilePicture')
      .execPopulate();

    if (addCommentDto.level === 2 && addCommentDto.parentComment) {
      await this.commentModel.updateOne(
        { _id: addCommentDto.parentComment },
        { $push: { subComments: newComment._id } },
      );
    }

    return newComment;
  }

  getComment(postId: string) {
    return this.commentModel
      .find({ post: postId, level: 1 })
      .populate({
        path: 'subComments',
        populate: {
          path: 'user',
        },
      })
      .populate('user', 'firstName surname profilePicture')
      .exec();
  }

  async deleteComment(id: string) {
    const comment = await this.commentModel.findOne({ _id: id }).exec();
    await this.commentModel
      .findOneAndUpdate({ subComments: id }, { $pull: { subComments: id } })
      .exec();

    if (comment.subComments) {
      this.commentModel.deleteMany({ _id: { $in: comment.subComments } });
    }
    return comment.remove();
  }
}
