import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDto } from 'src/modules/users/dtos/loginUser.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { UsersService } from './users.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class UsersLoginService {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private prismaService: PrismaService,
  ) {}

  async login(response: Response, loginUserDto: LoginUserDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        username: loginUserDto.username,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        createdAt: false,
        deletedAt: false,
        currentHashedRefreshToken: false,
        password: true,
        updatedAt: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User was not found');
    }

    const isPasswordCorrect = this.usersService.verifyPassword(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new ForbiddenException('Given password is not correct');
    }

    const refreshToken = this.authService.getCookieWithJwtRefreshToken({
      id: user.id,
    });
    const accessToken = this.authService.getCookieWithJwtToken({ id: user.id });

    response.setHeader('Set-Cookie', [accessToken, refreshToken.cookie]);

    await this.usersService.setCurrentRefreshToken(refreshToken.token, user.id);

    delete user.password;

    return user;
  }
}
