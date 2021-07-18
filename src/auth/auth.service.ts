import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import passport from 'passport';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { User } from '../user/schemas/user.schema';

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

    const newUser = {
      ...createUserDto,
      password: hashPassword,
    };

    await this.mailService.sendUserActivation(newUser, token);
    await this.userService.create(newUser, token);
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOne(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Wrong email');
    }

    if (!user.isActivated) {
      throw new UnauthorizedException('Please activate your account');
    }

    const compare = await bcrypt.compare(loginDto.password, user.password);

    if (!compare) {
      throw new UnauthorizedException('Wrong password');
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

  findUser(id: string) {
    return this.userService.findOneById(id);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findOne(email);

    if (!user) {
      throw new NotFoundException("Email doesn't exist");
    }

    const token = crypto.randomBytes(64).toString('hex');
    await this.mailService.sendForgotPassword(user, token);
    await this.userService.updateResetToken(user, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const hashPassword = await bcrypt.hash(resetPasswordDto.password, 10);

    await this.userService.resetPassword(
      resetPasswordDto.token,
      resetPasswordDto.email,
      hashPassword,
    );
  }

  updateUser(updateUserDto: UpdateUserDto, user: User) {
    return this.userService.updateUser(updateUserDto, user);
  }
}
