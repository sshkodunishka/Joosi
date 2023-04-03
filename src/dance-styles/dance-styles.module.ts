import { Module } from '@nestjs/common';
import { DanceStylesController } from './dance-styles.controller';
import { DanceStylesService } from './dance-styles.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DanceStylesController],
  providers: [DanceStylesService],
})
export class DanceStylesModule {}
