import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/*
 * Service dealing with jwt config based operations.
 *
 * @class
 * */
@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get accessTokenSecret(): string {
    return this.configService.get<string>('jwt.accessTokenSecret');
  }

  get accessTokenExpiresIn(): number {
    return this.configService.get<number>('jwt.accessTokenExpiresIn');
  }

  get refreshTokenSecret(): string {
    return this.configService.get<string>('jwt.refreshTokenSecret');
  }

  get refreshTokenExpiresIn(): number {
    return this.configService.get<number>('jwt.refreshTokenExpiresIn');
  }
}
