import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { RequestValidationPipe } from '../../common/pipes/RequestValidationPipe.pipe';
import { UsersLoginService } from './services/users-login.service';
import { UsersRegistrationService } from './services/users-registration.service';
import { UserId } from 'src/common/decorators/user.decorator';
import { Request, Response } from 'express';
import JwtAuthenticationGuard from '../auth/guards/jwt.guard';
import { UsersService } from './services/users.service';
import JwtRefreshTokenGuard from '../auth/guards/jwt-refresh.guard';
import { RegisterUserDto } from './dtos/registerUser.dto';
import { RegisterEmailVerifyDto } from './dtos/registerEmailVerify.dto';
import { LoginUserDto } from './dtos/loginUser.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersLoginService: UsersLoginService,
    private usersRegistrationService: UsersRegistrationService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersRegistrationService.register(registerUserDto);
  }

  @Post('/register/email/verify')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  registerEmailVerify(
    @Res({ passthrough: true }) response: Response,
    @Body() registerEmailVerifyDto: RegisterEmailVerifyDto,
  ) {
    return this.usersRegistrationService.registerEmailVerify(
      response,
      registerEmailVerifyDto,
    );
  }

  @Post('/login')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(200)
  login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
    return this.usersLoginService.login(response, loginUserDto);
  }

  @Post('/token/update')
  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(204)
  refreshAccessToken(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
    @UserId() userId: number,
  ) {
    return this.usersService.refreshAccessToken(response, request, userId);
  }

  @Post('/login/social/:name')
  loginBySocial(@Param('name') name: string) {
    return { name };
  }

  @Post('/logout')
  @UseGuards(JwtAuthenticationGuard)
  logout(
    @Res({ passthrough: true }) response: Response,
    @UserId() userId: number,
  ) {
    return this.usersService.logout(response, userId);
  }

  @Get('/me')
  @UseGuards(JwtAuthenticationGuard)
  getUser(@UserId() id: number) {
    return { id };
  }

  @Patch('/me')
  @UseGuards(JwtAuthenticationGuard)
  updateUser() {
    return {};
  }

  @Delete('/me')
  @UseGuards(JwtAuthenticationGuard)
  deleteUser() {
    return {};
  }
}
