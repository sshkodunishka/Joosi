import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RolesModule } from '../roles/roles.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';
import { UsersGateway } from './users.gateway';

@Module({
  imports: [RolesModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService, UsersGateway],
})
export class UsersModule {}
