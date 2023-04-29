import { Module } from '@nestjs/common';
import { DescriptionsController } from './descriptions.controller';
import { AuthModule } from '../auth/auth.module';
import { DescriptionsService } from './descriptions.service';

@Module({
  imports: [AuthModule],
  controllers: [DescriptionsController],
  providers: [DescriptionsService],
  exports: [DescriptionsService],
})
export class DescriptionsModule {}
