import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { DatabaseModule } from './database/database.module';
import { TalkshowsModule } from './talkshows/talkshows.module';
import { WorkshopsModule } from './workshops/workshops.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule, 
    AuthModule,
    PrismaModule,
    AdminAuthModule,
    DatabaseModule,
    TalkshowsModule,
    WorkshopsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
