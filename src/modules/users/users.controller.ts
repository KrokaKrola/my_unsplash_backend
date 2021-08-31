import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersLoginService: UsersLoginService,
    private usersRegistrationService: UsersRegistrationService,
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

  @Post('/login')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersLoginService.login(loginUserDto);
  }

  @Post('/login/verify')
  loginVerify() {
    return {};
  }

  @Post('/login/social/:name')
  loginBySocial(@Param('name') name: string) {
    return { name };
  }

  @Post('/logout')
  logout() {
    return {};
  }

  @Get('/me')
  getUser() {
    return {};
  }

  @Patch('/me')
  updateUser() {
    return {};
  }

  @Delete('/me')
  deleteUser() {
    return {};
  }
}
