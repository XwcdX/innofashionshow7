import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { User } from '@prisma/client';
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }
    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async create(email: string, name: string): Promise<User> {
        return this.prisma.user.create({ data: { email, name } });
    }

    async findAllPetra() {
        return this.prisma.user.findMany({
            where: {
                type: 'INTERNAL'
            },
            include: {
                internalProfile: true
            }
        });
    }

    async findAllUmum() {
        return this.prisma.user.findMany({
            where: {
                type: 'EXTERNAL'
            },
            include: {
                externalProfile: true
            }
        });
    }

    async validatePembayaran(id: string, updateTalkshowDto: Prisma.UserUpdateInput) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: updateTalkshowDto,
        });
    }
}