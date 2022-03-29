import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async findOneByEmail(email: string) {
    return await this.userRepository.findOne({ email });
  }

  async findOneByUsername(username: string) {
    return await this.userRepository.findOne({ username });
  }

  async findUserById(id: number) {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async setCurrentRefreshToken(refreshToken: string, userId: number) {
    const hashedToken = await argon2.hash(refreshToken);
    return this.userRepository.update(userId, {
      currentHashedRefreshToken: hashedToken,
    });
  }

  async logout(response: Response, userId: number) {
    await this.userRepository.update(userId, {
      currentHashedRefreshToken: null,
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

    const tokenVerificationResult = await user.verifyRefreshToken(
      request.cookies?.Refresh,
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
