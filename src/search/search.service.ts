import { Injectable, Logger } from '@nestjs/common';
import { SearchQueryDto } from './dto/search-query.dto';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';

@Injectable()
export class SearchService {
  private logger = new Logger(SearchService.name);

  constructor(
    private userService: UserService,
    private postService: PostService,
  ) {}

  async findAll(searchQueryDto: SearchQueryDto, userId: string) {
    this.logger.debug('Search Query: ' + searchQueryDto.search);
    const post = await this.postService.search(searchQueryDto);
    const user = await this.userService.search(searchQueryDto, userId);

    return {
      users: user,
      posts: post,
    };
  }
}
