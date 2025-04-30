import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Injectable()
export class AdminAuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
    ) { }

    async login(dto: AdminLoginDto) {
        const { email } = dto;

        const admin = await this.prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            throw new UnauthorizedException(`Email ${email} is not registered as admin`);
        }

        const payload = { sub: admin.id, email: admin.email, role: 'admin' as const };
        const token = this.jwtService.sign(payload);

        return { token, admin };
    }
}
