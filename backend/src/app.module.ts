import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { DatabaseModule } from './database/database.module';
import { TalkshowsModule } from './talkshows/talkshows.module';
import { WorkshopsModule } from './workshops/workshops.module';
import { ContestModule } from './contest/contest.module';
import { PrismaService } from 'prisma/prisma.service';
import { CreationModule } from './creation/creation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    ContestModule,
    AuthModule,
    PrismaModule,
    AdminAuthModule,
    DatabaseModule,
    TalkshowsModule,
    WorkshopsModule,
    CreationModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
