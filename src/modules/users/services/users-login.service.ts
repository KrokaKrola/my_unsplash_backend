import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDto } from 'src/models/users/dtos/loginUser.dto';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from './users.service';

@Injectable()
export class UsersLoginService {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  async login(
    response: Response,
    loginUserDto: LoginUserDto,
  ): Promise<UserEntity> {
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

    const refreshToken = this.authService.getCookieWithJwtRefreshToken({
      id: user.id,
    });
    const accessToken = this.authService.getCookieWithJwtToken({ id: user.id });

    response.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);

    await this.usersService.setCurrentRefreshToken(refreshToken.token, user.id);

    return user;
  }
}
