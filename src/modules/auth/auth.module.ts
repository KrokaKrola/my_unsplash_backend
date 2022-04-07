import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigurationModule } from 'src/config/jwt/configuration.module';
import { JwtConfigService } from 'src/config/jwt/configuration.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UsersService } from '../users/services/users.service';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    JwtConfigurationModule,
    JwtModule.registerAsync({
      imports: [JwtConfigurationModule],
      inject: [JwtConfigService],
      useFactory: async (jwtConfigService: JwtConfigService) => ({
        secret: jwtConfigService.accessTokenSecret,
        signOptions: {
          expiresIn: `${jwtConfigService.accessTokenExpiresIn}s`,
        },
      }),
    }),
  ],
  providers: [
    JwtStrategy,
    JwtRefreshStrategy,
    AuthService,
    UsersService,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
