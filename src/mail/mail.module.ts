import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: configService.get<string>('mail.mail_username'),
            pass: configService.get<string>('mail.mail_password'),
            clientId: configService.get<string>('mail.oauth_clientid'),
            clientSecret: configService.get<string>('mail.oauth_client_secret'),
            refreshToken: configService.get<string>('mail.oauth_refresh_token'),
          },
        },
        defaults: {
          from: 'yoonghongchoy@gmail.com',
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
