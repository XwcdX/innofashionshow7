import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service'; // Adjust path

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
}