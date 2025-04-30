import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        config: ConfigService,
        private prisma: PrismaService,
    ) {
        const jwtSecret = config.get<string>('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET must be set in .env');
        }

        const options: StrategyOptions = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
        };

        super(options);
    }

    async validate(payload: { sub: string; email: string }) {
        const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
        if (!user) throw new UnauthorizedException();
        return user;
    }
}
