import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/*
 * Service dealing with api config based operations.
 *
 * @class
 * */
@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get version(): string {
    return this.configService.get<string>('api.version');
  }

  get baseUrl(): string {
    return this.configService.get<string>('api.baseUrl');
  }
}
