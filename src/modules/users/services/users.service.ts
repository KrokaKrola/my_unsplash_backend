import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private authService: AuthService,
    private prismaService: PrismaService,
  ) {}

  async findOneByEmail(email: string) {
    return await this.prismaService.user.findFirst({ where: { email } });
  }

  async findOneByUsername(username: string) {
    return await this.prismaService.user.findFirst({ where: { username } });
  }

  async findUserById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  verifyPassword(password: crypto.BinaryLike, hashedPassword: string) {
    const hash = crypto
      .pbkdf2Sync(password, 'password_salt', 1000, 64, 'sha512')
      .toString('hex');

    return hash === hashedPassword;
  }

  verifyRefreshToken(token: crypto.BinaryLike, hashedToken: string) {
    const hash = crypto
      .pbkdf2Sync(token, 'token_salt', 500, 64, 'sha512')
      .toString('hex');

    return hash === hashedToken;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashedToken = crypto
      .pbkdf2Sync(refreshToken, 'token_salt', 500, 64, 'sha512')
      .toString('hex');
    return this.prismaService.user.update({
      where: { id: userId },
      data: {
        currentHashedRefreshToken: hashedToken,
      },
    });
  }

  async logout(response: Response, userId: number) {
    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        currentHashedRefreshToken: null,
      },
    });
    response.setHeader('Set-Cookie', this.authService.getCookiesForLogout());
    return response.sendStatus(200);
  }

  async refreshAccessToken(
    response: Response,
    request: Request,
    userId: number,
  ) {
    const user = await this.findUserById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const tokenVerificationResult = this.verifyRefreshToken(
      request.cookies?.Refresh,
      user.currentHashedRefreshToken,
    );

    if (tokenVerificationResult) {
      response.setHeader(
        'Set-Cookie',
        this.authService.getCookieWithJwtToken({ id: userId }),
      );

      return response.sendStatus(200);
    } else {
      throw new UnauthorizedException();
    }
  }
}
