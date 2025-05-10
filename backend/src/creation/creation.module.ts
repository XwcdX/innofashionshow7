import { Module } from '@nestjs/common';
import { CreationController } from './creation.controller';
import { CreationService } from './creation.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [CreationController],
  providers: [CreationService, PrismaService],
})
export class CreationModule {}