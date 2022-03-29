import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/jwt/configuration.service';
import { IJwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private jwtConfigService: JwtConfigService,
  ) {}

  getCookieWithJwtToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfigService.accessTokenExpiresIn}`;
  }

  public getCookieWithJwtRefreshToken(payload: IJwtPayload) {
    const token = this.jwtService.sign(payload, {
      secret: this.jwtConfigService.refreshTokenSecret,
      expiresIn: `${this.jwtConfigService.refreshTokenExpiresIn}s`,
    });
    const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.jwtConfigService.refreshTokenExpiresIn}`;

    return {
      cookie,
      token,
    };
  }

  getCookiesForLogout() {
    return [
      `Authentication=; HttpOnly; Path=/; Max-Age=0`,
      `Refresh=; HttpOnly; Path=/; Max-Age=0`,
    ];
  }
}
