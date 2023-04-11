import { Module } from '@nestjs/common';
import { DanceStylesController } from './dance-styles.controller';
import { DanceStylesService } from './dance-styles.service';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';

@Module({
  imports: [AuthModule, RolesModule],
  controllers: [DanceStylesController],
  providers: [DanceStylesService],
  exports: [DanceStylesService],
})
export class DanceStylesModule {}
