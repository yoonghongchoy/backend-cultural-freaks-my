import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<void> {
    const user = await this.userService.findOne(createUserDto.email);

    if (user) {
      throw new ConflictException('Email already exists');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 10);
    const token = crypto.randomBytes(64).toString('hex');

    const newUser = await this.userService.create(
      {
        ...createUserDto,
        password: hashPassword,
      },
      token,
    );
    await this.mailService.sendUserActivation(newUser, token);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActivated) {
      throw new UnauthorizedException('Please activate your account');
    }

    const compare = await bcrypt.compare(loginDto.password, user.password);

    if (!compare) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }

  async activate(token: string) {
    const existingUser = await this.userService.updateIsActivated(token);

    if (!existingUser) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: existingUser.email };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    return { accessToken };
  }
}
