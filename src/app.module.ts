import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PostModule } from './post/post.module';
import { FriendModule } from './friend/friend.module';
import { SearchModule } from './search/search.module';
import { NotificationModule } from './notification/notification.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('mongodb_uri'),
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    MailModule,
    PostModule,
    FriendModule,
    SearchModule,
    NotificationModule,
    FileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
