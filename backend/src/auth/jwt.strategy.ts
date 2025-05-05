import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { User, UserType } from '@prisma/client';

interface JwtPayload {
    sub: string;
    email: string;
    role: UserType;
    iat: number;
    exp: number;
}

type RequestUser = Pick<User, 'id' | 'email' | 'name' | 'type'>;


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    private readonly logger = new Logger(JwtStrategy.name);

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

    async validate(payload: JwtPayload): Promise<RequestUser> {
        this.logger.debug(`Validating JWT payload for user sub: ${payload.sub}`);
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user) {
            this.logger.warn(`User not found during JWT validation for sub: ${payload.sub}`);
            throw new UnauthorizedException('User not found or invalid token.');
        }

        if (user.type !== payload.role) {
            this.logger.warn(`User type mismatch for sub: ${payload.sub}. JWT role: ${payload.role}, DB type: ${user.type}`);
            throw new UnauthorizedException('User role/type mismatch.');
        }


        this.logger.debug(`JWT validation successful for user: ${user.email}`);

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            type: user.type,
        };
    }
}