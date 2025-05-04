import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DraftContestDto } from './dto/draft-contest.dto';
import { SubmitContestDto } from './dto/submit-contest.dto';
import { Prisma, Contest, UserType, Category } from '@prisma/client';

@Injectable()
export class ContestService {
    private readonly logger = new Logger(ContestService.name);

    constructor(private readonly prisma: PrismaService) { }

    async saveDraft(userId: string, dto: DraftContestDto): Promise<Contest | null> {
        this.logger.log(`Attempting to save contest draft for user ID: ${userId}`);

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            this.logger.warn(`User not found for ID: ${userId} while saving draft.`);
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        const updateData: Prisma.ContestUpdateInput = {
            ...(dto.category !== undefined && { category: dto.category }),
            ...(dto.age !== undefined && { age: dto.age }),
            ...(dto.whatsapp !== undefined && { whatsapp: dto.whatsapp }),
            ...(dto.proofOfPayment !== undefined && { proofOfPayment: dto.proofOfPayment }),
            ...(user.type === UserType.INTERNAL && dto.nrp !== undefined && { nrp: dto.nrp }),
            ...(user.type === UserType.INTERNAL && dto.batch !== undefined && { batch: dto.batch }),
            ...(user.type === UserType.INTERNAL && dto.major !== undefined && { major: dto.major }),
            ...(user.type === UserType.INTERNAL && dto.ktmPath !== undefined && { ktmPath: dto.ktmPath }),
            ...(user.type === UserType.EXTERNAL && dto.instance !== undefined && { instance: dto.instance }),
            ...(user.type === UserType.EXTERNAL && dto.idCardPath !== undefined && { idCardPath: dto.idCardPath }),
            updatedAt: new Date(),
        };


        if (Object.keys(updateData).length <= 1) {
            this.logger.log(`No actual draft data provided to update for user ${userId}. Skipping contest update.`);
            return this.prisma.contest.findUnique({ where: { userId } });
        }

        const createData: Prisma.ContestCreateInput = {
            user: { connect: { id: userId } },
            category: dto.category ?? Category.INTERMEDIATE,
            age: dto.age ?? null,
            whatsapp: dto.whatsapp ?? null,
            proofOfPayment: dto.proofOfPayment ?? null,
            nrp: (user.type === UserType.INTERNAL && dto.nrp !== undefined) ? dto.nrp : null,
            batch: (user.type === UserType.INTERNAL && dto.batch !== undefined) ? dto.batch : null,
            major: (user.type === UserType.INTERNAL && dto.major !== undefined) ? dto.major : null,
            ktmPath: (user.type === UserType.INTERNAL && dto.ktmPath !== undefined) ? dto.ktmPath : null,
            instance: (user.type === UserType.EXTERNAL && dto.instance !== undefined) ? dto.instance : null,
            idCardPath: (user.type === UserType.EXTERNAL && dto.idCardPath !== undefined) ? dto.idCardPath : null,
            valid: false,
        };

        try {
            this.logger.log(`Upserting contest draft for user ${userId}`);
            const savedContest = await this.prisma.contest.upsert({
                where: { userId: userId },
                create: createData,
                update: updateData,
            });
            this.logger.log(`Successfully saved contest draft for user ID: ${userId}`);
            return savedContest;
        } catch (error) {
            this.logger.error(`Failed to save contest draft for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to save contest draft data.');
        }
    }

    async submitContest(userId: string, dto: SubmitContestDto): Promise<Contest> {
        this.logger.log(`Attempting final contest submission for user ID: ${userId}`);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            this.logger.warn(`User not found for ID: ${userId} during submission attempt.`);
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }
        this.logger.log(`User type fetched in service for validation: ${user.type}`);

        const missingFields: string[] = [];
        if (user.type === UserType.INTERNAL) {
            if (!dto.nrp) missingFields.push('NRP');
            if (!dto.batch) missingFields.push('Batch');
            if (!dto.major) missingFields.push('Major');
            if (!dto.ktmPath) missingFields.push('KTM Path');
        } else if (user.type === UserType.EXTERNAL) {
            if (!dto.instance) missingFields.push('Instance/School');
            if (!dto.idCardPath) missingFields.push('ID Card Path');
        }
        if (!dto.category) missingFields.push('Category');
        if (!dto.age) missingFields.push('Age');
        if (!dto.whatsapp) missingFields.push('Whatsapp');
        if (!dto.proofOfPayment) missingFields.push('Proof of Payment');

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields for ${user.type} user contest submission: ${missingFields.join(', ')}.`;
            this.logger.warn(`Submission validation failed for user ${userId}: ${errorMessage}`);
            throw new BadRequestException(errorMessage);
        }
        // --- End Validation ---

        const updateData: Prisma.ContestUpdateInput = {
            category: dto.category,
            age: dto.age,
            whatsapp: dto.whatsapp,
            proofOfPayment: dto.proofOfPayment,
            valid: false,
            nrp: user.type === UserType.INTERNAL ? dto.nrp : null,
            batch: user.type === UserType.INTERNAL ? dto.batch : null,
            major: user.type === UserType.INTERNAL ? dto.major : null,
            ktmPath: user.type === UserType.INTERNAL ? dto.ktmPath : null,
            instance: user.type === UserType.EXTERNAL ? dto.instance : null,
            idCardPath: user.type === UserType.EXTERNAL ? dto.idCardPath : null,
            updatedAt: new Date(),
        };

        const createData: Prisma.ContestCreateInput = {
            user: { connect: { id: userId } },
            category: dto.category,
            age: dto.age,
            whatsapp: dto.whatsapp,
            proofOfPayment: dto.proofOfPayment,
            valid: false,
            nrp: user.type === UserType.INTERNAL ? dto.nrp : null,
            batch: user.type === UserType.INTERNAL ? dto.batch : null,
            major: user.type === UserType.INTERNAL ? dto.major : null,
            ktmPath: user.type === UserType.INTERNAL ? dto.ktmPath : null,
            instance: user.type === UserType.EXTERNAL ? dto.instance : null,
            idCardPath: user.type === UserType.EXTERNAL ? dto.idCardPath : null,
        };

        try {
            this.logger.log(`Upserting final contest submission for user ${userId}`);
            const submittedContest = await this.prisma.contest.upsert({
                where: { userId: userId },
                create: createData,
                update: updateData,
            });
            this.logger.log(`Successfully submitted contest registration for user ID: ${userId}`);
            return submittedContest;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                this.logger.error(`Prisma error during contest submission for user ${userId}: ${error.message}`, error.stack);
                throw new InternalServerErrorException('Database error during contest submission.');
            }
             if (error instanceof BadRequestException || error instanceof NotFoundException) {
                 throw error;
             }
            this.logger.error(`Failed to submit contest registration for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to submit contest registration.');
        }
    }

    async getContestProfile(userId: string): Promise<Contest | null> {
        this.logger.log(`Fetching contest profile for user ID: ${userId}`);
        const contestRegistration = await this.prisma.contest.findUnique({
            where: { userId: userId },
        });

        if (!contestRegistration) {
            this.logger.log(`No contest registration found for user ID: ${userId}`);
            return null;
        }
        return contestRegistration;
    }
}