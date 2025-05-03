import { Module }                 from '@nestjs/common';
import { JwtModule }              from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule }           from '../../prisma/prisma.module';
import { AdminAuthService }       from './admin-auth.service';
import { AdminAuthController }    from './admin-auth.controller';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AdminAuthService],
  controllers: [AdminAuthController],
})
export class AdminAuthModule {}
