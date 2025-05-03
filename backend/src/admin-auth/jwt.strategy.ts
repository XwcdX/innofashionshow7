import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        const jwtSecret = config.get<string>('JWT_SECRET');

        if (!jwtSecret) {
            console.error('FATAL ERROR: JWT_SECRET environment variable is not set!');
            throw new Error('JWT_SECRET must be set in .env for JwtStrategy initialization');
        }
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: jwtSecret,
            ignoreExpiration: false,
        });
    }
    private readonly logger = new Logger(JwtStrategy.name);

    async validate(payload: { sub: string; email: string; role: string; iat: number; exp: number }) {
        this.logger.debug(`Validating JWT payload for user sub: ${payload.sub}`);
        console.log(payload.sub);

        const admin = await this.prisma.admin.findUnique({
            where: { id: payload.sub },
        });

        if (!admin) {
            this.logger.warn(`Admin not found during JWT validation for sub: ${payload.sub}`);
            throw new UnauthorizedException('Admin not found or invalid token.');
        }

        this.logger.debug(`JWT validation successful for user: ${admin.email}`);
        return admin;
    }
}