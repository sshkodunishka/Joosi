import { Module, forwardRef } from '@nestjs/common';
import { MasterClassesController } from './master-classes.controller';
import { MasterClassesService } from './master-classes.service';
import { AuthModule } from '../auth/auth.module';
import { RequestsModule } from '../requests/requests.module';

@Module({
  imports: [forwardRef(() => RequestsModule), AuthModule],
  controllers: [MasterClassesController],
  providers: [MasterClassesService],
  exports: [MasterClassesService],
})
export class MasterClassesModule {}
