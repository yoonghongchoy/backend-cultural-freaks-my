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
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('/login')
  @HttpCode(200)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('/activate')
  @HttpCode(200)
  activate(@Query('token') token: string) {
    return this.authService.activate(token);
  }

  @Get('/forgot/:email')
  forgotPassword(@Param('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('/reset')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
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

  @UseGuards(AuthGuard())
  @Post('/user/editProfile')
  editProfile(@Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
    return this.authService.updateUser(updateUserDto, user);
  }
}
