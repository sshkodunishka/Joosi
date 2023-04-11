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
    MasterClassesModule,
    RequestsModule,
    DescriptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
