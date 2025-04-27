// src/users/users.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TalkshowsController } from './talkshows.controller';
import { TalkshowsService } from './talkshows.service';
import { Talkshow } from './talkshow.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Talkshow])],
    controllers: [TalkshowsController],
    providers: [TalkshowsService],
})
export class TalkshowsModule {}
