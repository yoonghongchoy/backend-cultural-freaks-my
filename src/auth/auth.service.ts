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
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });

    const token = Math.floor(1000 + Math.random() * 9000).toString();
    await this.mailService.sendUserActivation(newUser, token);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.findOne(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
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
}
