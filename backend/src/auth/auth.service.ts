import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UserType } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService
    ) { }

    async login(dto: LoginDto) {
        const { email, name, category } = dto;
        const existing = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existing) {
            if (existing.category !== category) {
                throw new HttpException(
                    {
                        error: 'ALREADY_REGISTERED',
                        registeredCategory: existing.category,
                        message: `You’re already in "${existing.category}"`,
                    },
                    HttpStatus.CONFLICT
                );
            }

            if (existing.name !== name) {
                await this.prisma.user.update({
                    where: { email },
                    data: { name },
                });
            }

            const payload = {
                sub: existing.id,
                email: existing.email,
                role: existing.type,
            };
            const token = this.jwtService.sign(payload);
            return { token, user: existing };
        }

        const [localPart, domain] = email.split('@');
        const isInternalEmail =
            !!localPart?.match(/^[A-Za-z]\d{8}$/) &&
            domain === 'john.petra.ac.id';

        const type = isInternalEmail
            ? UserType.INTERNAL
            : UserType.EXTERNAL;

        const user = await this.prisma.user.create({
            data: { email, name, type, category },
        });

        const payload = { sub: user.id, email: user.email, role: type };
        const token = this.jwtService.sign(payload);

        return { token, user };
    }

}
