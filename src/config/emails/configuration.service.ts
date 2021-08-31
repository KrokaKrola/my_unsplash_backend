import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/*
 * Service dealing with app config based operations.
 *
 * @class
 * */
@Injectable()
export class EmailsConfigurationService {
  constructor(private configService: ConfigService) {}

  get id(): string {
    return this.configService.get<string>('emails.id');
  }

  get password(): string {
    return this.configService.get<string>('emails.password');
  }

  get host(): string {
    return this.configService.get<string>('emails.host');
  }

  get port(): number {
    return this.configService.get<number>('emails.port');
  }
}
