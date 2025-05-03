import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UserType, User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async login(dto: LoginDto): Promise<{ token: string; user: User }> {
        const { email, name } = dto;

        const [localPart, domain] = email.split('@');
        const isInternalEmail =
            !!localPart?.match(/^[A-Za-z]\d{8}$/) &&
            domain === 'john.petra.ac.id';

        const calculatedType: UserType = isInternalEmail
            ? UserType.INTERNAL
            : UserType.EXTERNAL;

        const user = await this.prisma.user.upsert({
            where: { email: email },
            update: {
                name: name,
                type: calculatedType,
            },
            create: {
                email: email,
                name: name,
                type: calculatedType,
            },
        });

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.type,
        };

        const token = this.jwtService.sign(payload);
        return { token, user };
    }
}