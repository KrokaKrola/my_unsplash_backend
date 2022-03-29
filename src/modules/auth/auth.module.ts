import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtConfigurationModule } from 'src/config/jwt/configuration.module';
import { JwtConfigService } from 'src/config/jwt/configuration.service';
import { UserEntity } from 'src/models/users/entities/user.entity';
import { UsersService } from '../users/services/users.service';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
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
  providers: [JwtStrategy, JwtRefreshStrategy, AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
