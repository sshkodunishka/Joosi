import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PrismaModule } from 'nestjs-prisma';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { DanceStylesModule } from './dance-styles/dance-styles.module';
import { MasterClassesModule } from './master-classes/master-classes.module';
import { RequestsModule } from './requests/requests.module';
import { DescriptionsModule } from './descriptions/descriptions.module';
import { FilesModule } from './files/files.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    RedisModule,
    DanceStylesModule,
    RequestsModule,
    MasterClassesModule,
    DescriptionsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
