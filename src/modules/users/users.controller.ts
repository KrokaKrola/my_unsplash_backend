import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { RegisterUserDto } from '../../models/users/dtos/registerUser.dto';
import { RequestValidationPipe } from '../../common/pipes/RequestValidationPipe.pipe';
import { LoginUserDto } from 'src/models/users/dtos/loginUser.dto';
import registerConflictResponseSwagger from 'src/modules/users/swagger/register/registerConflictResponse.swagger';
import registerUnprocessableEntityResponseSwagger from 'src/modules/users/swagger/register/registerUnprocessableEntityResponse.swagger';
import registerCreatedResponseSwagger from 'src/modules/users/swagger/register/registerCreatedResponse.swagger';
import { UsersLoginService } from './services/users-login.service';
import { UsersRegistrationService } from './services/users-registration.service';
import { UserId } from 'src/common/decorators/user.decorator';
import { RegisterEmailVerifyDto } from 'src/models/users/dtos/registerEmailVerify.dto';
import { Request, Response } from 'express';
import JwtAuthenticationGuard from '../auth/guards/jwt.guard';
import { UsersService } from './services/users.service';
import JwtRefreshTokenGuard from '../auth/guards/jwt-refresh.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersLoginService: UsersLoginService,
    private usersRegistrationService: UsersRegistrationService,
    private usersService: UsersService,
  ) {}

  @Post('/register')
  @ApiCreatedResponse(registerCreatedResponseSwagger)
  @ApiUnprocessableEntityResponse(registerUnprocessableEntityResponseSwagger)
  @ApiConflictResponse(registerConflictResponseSwagger)
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
    @Body() regiserEmailVerifyDto: RegisterEmailVerifyDto,
  ) {
    return this.usersRegistrationService.registerEmailVerify(
      response,
      regiserEmailVerifyDto,
    );
  }

  @Post('/login')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  login(
    @Res({ passthrough: true }) response: Response,
    @Body() loginUserDto: LoginUserDto,
  ) {
    return this.usersLoginService.login(response, loginUserDto);
  }

  @Post('/token/update')
  @UseGuards(JwtRefreshTokenGuard)
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
