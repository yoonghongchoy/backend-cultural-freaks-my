import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from './get-user.decorator';
import { User } from '../user/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto): Promise<void> {
    return this.authService.signUp(createUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginDto);
  }

  @Get('/activate')
  @HttpCode(200)
  activate(@Query('token') token: string) {
    return this.authService.activate(token);
  }

  @UseGuards(AuthGuard())
  @Get('/user')
  findOneByToken(@GetUser() user: User) {
    return this.authService.findUser(user._id);
  }

  @UseGuards(AuthGuard())
  @Get('/user/:id')
  findOneById(@Param('id') id: string) {
    return this.authService.findUser(id);
  }
}
