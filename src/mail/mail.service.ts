import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);

  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async sendUserActivation(user: CreateUserDto, token: string): Promise<void> {
    const url = `${this.configService.get<string>(
      'frontend_url',
    )}/activation?token=${token}`;

    this.logger.debug(`Sending email to ${user.email}`);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Cultural Freaks MY Activation Email',
      template: './activation',
      context: {
        name: user.firstName,
        url,
      },
    });
    this.logger.debug(`Email sent to ${user.email}`);
  }

  async sendForgotPassword(user: User, token: string) {
    const url = `${this.configService.get<string>(
      'frontend_url',
    )}/reset?token=${token}`;

    this.logger.debug(`Sending reset email to ${user.email}`);
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password reset request',
      template: './forgot-password',
      context: {
        name: user.firstName,
        url,
      },
    });
    this.logger.debug(`Reset email sent to ${user.email}`);
  }
}
