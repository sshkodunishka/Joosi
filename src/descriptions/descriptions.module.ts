import { Module } from '@nestjs/common';
import { DescriptionsController } from './descriptions.controller';
import { AuthModule } from '../auth/auth.module';
import { DescriptionsService } from './descriptions.service';
import { RequestsModule } from '../requests/requests.module';

@Module({
  imports: [RequestsModule, AuthModule],
  controllers: [DescriptionsController],
  providers: [DescriptionsService],
  exports: [DescriptionsService],
})
export class DescriptionsModule {}
