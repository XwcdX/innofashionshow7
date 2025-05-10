import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Contest, UserType, Category, Creation } from '@prisma/client';

@Injectable()
export class CreationService {
    private readonly logger = new Logger(CreationService.name);

    constructor(private readonly prisma: PrismaService) { }

    async allCreation(): Promise< Creation[] | null> {
        const allCreation = await this.prisma.creation.findMany({
            include: {
                contest: {
                    include: {
                        user: true,
                    }
                },
            }
        })

        return allCreation ; 
    }
}