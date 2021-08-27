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

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/register')
  @ApiCreatedResponse()
  @ApiUnprocessableEntityResponse()
  @ApiConflictResponse({
    schema: {
      example: {
        test: 'fdsf',
      },
    },
  })
  @ApiConflictResponse()
  @UsePipes(RequestValidationPipe)
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.usersService.register(registerUserDto);
  }

  @Post('/login')
  login() {
    return {};
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
