import { Module } from '@nestjs/common';
import { DanceStylesController } from './dance-styles.controller';
import { DanceStylesService } from './dance-styles.service';

@Module({
  controllers: [DanceStylesController],
  providers: [DanceStylesService],
})
export class DanceStylesModule {}
