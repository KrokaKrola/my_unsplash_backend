import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: '30d',
      },
    }),
  ],
  providers: [JwtStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
