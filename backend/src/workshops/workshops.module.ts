import { Module } from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { WorkshopsController } from './workshops.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [WorkshopsController],
  providers: [WorkshopsService],
})
export class WorkshopsModule {}
