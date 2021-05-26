import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '../user/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private logger = new Logger(MailService.name);

  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async sendUserActivation(user: User, token: string): Promise<void> {
    const url = `http://${this.configService.get<string>(
      'host',
    )}:${this.configService.get<string>('port')}/auth/confirm?token=${token}`;

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
}