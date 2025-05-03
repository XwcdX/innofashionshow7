import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
// import { PrismaService } from 'prisma/prisma.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})

export class UsersModule {}