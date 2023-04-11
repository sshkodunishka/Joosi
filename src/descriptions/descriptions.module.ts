import { Module } from '@nestjs/common';
import { DescriptionsController } from './descriptions.controller';
import { DescriptionsService } from './descriptions.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DescriptionsController],
  providers: [DescriptionsService],
  exports: [DescriptionsService],
})
export class DescriptionsModule {}
