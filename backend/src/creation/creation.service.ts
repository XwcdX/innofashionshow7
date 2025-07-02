import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma, Contest, UserType, Category, Creation } from '@prisma/client';

@Injectable()
export class CreationService {
    private readonly logger = new Logger(CreationService.name);

    constructor(private readonly prisma: PrismaService) { }

    async allCreation(): Promise< Creation[] | null> {
        const allCreation = await this.prisma.creation.findMany({
            where: {
                submitted: true,
            },
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

    async getCreationStatus(userId: string): Promise<{ creationStatus: boolean | null } | null> {
        this.logger.log(`Fetching creation status for user ID: ${userId}`);
        // Fetch only the 'category' field from the contest record
        const contestRegistration = await this.prisma.contest.findUnique({
            where: { userId: userId },
            select: {
                id: true,  // Only select the 'category' field
            },
        });

        if(!contestRegistration){
            this.logger.log(`No contest found for user ID: ${userId}`);
            return null;
        }

        const creationStatus = await this.prisma.creation.findUnique({
            where: { contestId: contestRegistration.id },
            select: {
                submitted: true,
            },
        });

        if (!creationStatus) {
            this.logger.log(`No creation found for user ID: ${userId}`);
            return null;
        }

        return { creationStatus :  creationStatus.submitted}; 
    }
}