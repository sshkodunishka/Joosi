import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { RedisClient } from '../redis/redis.client';
import { RedisModule } from '../redis/redis.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    forwardRef(() => UsersModule),
    RedisModule,
    RolesModule,
  ],
})
export class AuthModule {}
