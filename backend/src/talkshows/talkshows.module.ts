import { Module } from '@nestjs/common';
import { TalkshowsService } from './talkshows.service';
import { TalkshowsController } from './talkshows.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [TalkshowsController],
  providers: [TalkshowsService],
})
export class TalkshowsModule {}
