import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
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
import { UsersService } from './users.service';
import { RequestValidationPipe } from '../../common/pipes/RequestValidationPipe.pipe';
import { LoginUserDto } from 'src/models/users/dtos/loginUser.dto';
import registerConflictResponseSwagger from 'src/models/users/swagger/register/registerConflictResponse.swagger';
import registerUnpocessableEntityReponseSwagger from 'src/models/users/swagger/register/registerUnpocessableEntityReponse.swagger';
import registerCreatedResponseSwagger from 'src/models/users/swagger/register/registerCreatedResponse.swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  @ApiCreatedResponse(registerCreatedResponseSwagger)
  @ApiUnprocessableEntityResponse(registerUnpocessableEntityReponseSwagger)
  @ApiConflictResponse(registerConflictResponseSwagger)
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  @Post('/login')
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
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
