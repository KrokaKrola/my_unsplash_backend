import { Injectable } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { JwtConfigService } from 'src/config/jwt/configuration.service';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/services/users.service';
import { IJwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private readonly jwtConfigService: JwtConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConfigService.refreshTokenSecret,
    });
  }

  async validate(payload: IJwtPayload) {
    return this.usersService.findUserById(payload.id);
  }
}
