import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  signToken(userId: number, email: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
    });
  }
}
