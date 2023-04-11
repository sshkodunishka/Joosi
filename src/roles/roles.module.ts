import { Module, forwardRef } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RolesController],
  exports: [RolesService],
  providers: [RolesService],
})
export class RolesModule {}
