import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PostModule, UserModule, AuthModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
