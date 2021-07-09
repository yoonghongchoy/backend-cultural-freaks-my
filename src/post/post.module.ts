import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { AuthModule } from '../auth/auth.module';
import { Comments, CommentSchema } from './schemas/comment.schema';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GridFsMulterConfigService } from '../file/multer-config.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: Comments.name,
        schema: CommentSchema,
      },
    ]),
    AuthModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: GridFsMulterConfigService,
      inject: [ConfigService],
    }),
    FileModule,
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
