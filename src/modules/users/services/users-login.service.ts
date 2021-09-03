import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from 'src/models/users/dtos/loginUser.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersLoginService {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findOneByUsername(
      loginUserDto.username,
    );

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    const isPasswordCorrect = await user.verifyPassword(loginUserDto.password);

    if (!isPasswordCorrect) {
      throw new ForbiddenException('Given password is not correct');
    }

    return { token: this.authService.signToken(user.id, user.email), user };
  }
}
