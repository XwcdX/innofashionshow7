import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DraftContestDto } from './dto/draft-contest.dto';
import { SubmitContestDto } from './dto/submit-contest.dto';
import { Prisma, Contest, UserType, Category, Creation } from '@prisma/client';

@Injectable()
export class ContestService {
    private readonly logger = new Logger(ContestService.name);

    constructor(private readonly prisma: PrismaService) { }

    async getCategory(userId: string): Promise<{ category: string | null } | null> {
        this.logger.log(`Fetching contest profile for user ID: ${userId}`);
        // Fetch only the 'category' field from the contest record
        const contestRegistration = await this.prisma.contest.findUnique({
            where: { userId: userId },
            select: {
                category: true,  // Only select the 'category' field
            },
        });

        if (!contestRegistration) {
            this.logger.log(`No contest registration found for user ID: ${userId}`);
            return null;
        }

        return { category: contestRegistration.category }; 
    }

    async getValidate(userId: string): Promise<{ validateStatus: boolean | null } | null> {
        this.logger.log(`Fetching valid status for user ID: ${userId}`);
        // Fetch only the 'category' field from the contest record
        const contestRegistration = await this.prisma.contest.findUnique({
            where: { userId: userId },
            select: {
                valid: true,  // Only select the 'category' field
            },
        });

        if (!contestRegistration) {
            this.logger.log(`No valid status found for user ID: ${userId}`);
            return {validateStatus: null};
        }

        return { validateStatus: contestRegistration.valid }; 
    }

    async getSubmitted(userId: string): Promise<{ submittedStatus: boolean | null } | null> {
        this.logger.log(`Fetching submitted status for user ID: ${userId}`);
        // Fetch only the 'category' field from the contest record
        const contestRegistration = await this.prisma.contest.findUnique({
            where: { userId: userId },
            select: {
                submitted: true,  // Only select the 'category' field
            },
        });

        if (!contestRegistration) {
            this.logger.log(`No submitted status found for user ID: ${userId}`);
            return null;
        }

        return { submittedStatus: contestRegistration.submitted }; 
    }

    async saveDraft(userId: string, dto: DraftContestDto): Promise<Contest | null> {
        this.logger.log(`Attempting to save contest draft for user ID: ${userId}`);

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            this.logger.warn(`User not found for ID: ${userId} while saving draft.`);
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }
        const updateUserData: Prisma.UserUpdateInput = {
            ...(dto.name !== undefined && { name: dto.name }),
            updatedAt: new Date(),
        };

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
            if (dto.name !== undefined) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: updateUserData,
                });
            }
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

    async saveCreationDraft(userId: string, dto: Prisma.CreationCreateInput): Promise<Creation | null> {
        this.logger.log(`Attempting to save creation draft for user ID: ${userId}`);

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            this.logger.warn(`User not found for ID: ${userId} while saving draft.`);
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }
        
        const contest = await this.prisma.contest.findUnique({ where: { userId: userId } });

        const updateData: Prisma.CreationUpdateInput = {
            ...(dto.creationPath !== undefined && { creationPath: dto.creationPath }),
            ...(dto.conceptPath !== undefined && { conceptPath: dto.conceptPath }),
            updatedAt: new Date(),
        };


        if (Object.keys(updateData).length <= 1) {
            this.logger.log(`No actual draft data provided to update for user ${userId}. Skipping creation update.`);
            return this.prisma.creation.findUnique({ where: { contestId: contest?.id } });
        }

        const createData: Prisma.CreationCreateInput = {
            contest: { connect: { id: contest?.id } },
            creationPath: dto.creationPath ?? null,
            conceptPath: dto.conceptPath ?? null,
        };

        try {
            this.logger.log(`Upserting creation draft for user ${userId}`);
            const savedContest = await this.prisma.creation.upsert({
                where: { contestId: contest?.id },
                create: createData,
                update: updateData,
            });
            this.logger.log(`Successfully saved creation draft for user ID: ${userId}`);
            return savedContest;
        } catch (error) {
            this.logger.error(`Failed to save creation draft for user ${userId}: ${error.message}`, error.stack);
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
        const updateUserData: Prisma.UserUpdateInput = {
            ...(dto.name !== undefined && { name: dto.name }),
            updatedAt: new Date(),
        };

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
        if (!dto.name) missingFields.push('Name');
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
            submitted: true,
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
            submitted: true,
        };

        try {
            this.logger.log(`Upserting final contest submission for user ${userId}`);
            if (dto.name !== undefined) {
                await this.prisma.user.update({
                    where: { id: userId },
                    data: updateUserData,
                });
            }
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

    async submitCreation(userId: string, dto: Prisma.CreationCreateInput): Promise<Creation> {
        this.logger.log(`Attempting final creation submission for user ID: ${userId}`);
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            this.logger.warn(`User not found for ID: ${userId} during submission attempt.`);
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        const contest = await this.prisma.contest.findUnique({ where: { userId: userId } });
        if (!contest) {
            this.logger.warn(`Contest not found for UserID: ${userId} during submission attempt.`);
            throw new NotFoundException(`Contest with UserID ${userId} not found.`);
        }

        this.logger.log(`User type fetched in service for validation: ${user.type}`);

        const missingFields: string[] = [];
        if (!dto.creationPath) missingFields.push('Creation File');
        if (!dto.conceptPath) missingFields.push('Concept File');

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields for ${user.type} user creation submission: ${missingFields.join(', ')}.`;
            this.logger.warn(`Submission validation failed for user ${userId}: ${errorMessage}`);
            throw new BadRequestException(errorMessage);
        }
        // --- End Validation ---

        const updateData: Prisma.CreationUpdateInput = {
            creationPath: dto.creationPath,
            conceptPath: dto.conceptPath,
            submitted: true,
            
            updatedAt: new Date(),
        };

        const createData: Prisma.CreationCreateInput = {
            contest: { connect: { id: contest.id } },
            creationPath: dto.creationPath ?? null,
            conceptPath: dto.conceptPath ?? null,
            submitted: true,
        };

        try {
            this.logger.log(`Upserting creation draft for user ${userId}`);
            const savedContest = await this.prisma.creation.upsert({
                where: { contestId: contest?.id },
                create: createData,
                update: updateData,
            });
            this.logger.log(`Successfully saved contest draft for user ID: ${userId}`);
            return savedContest;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                this.logger.error(`Prisma error during creation submission for user ${userId}: ${error.message}`, error.stack);
                throw new InternalServerErrorException('Database error during creation submission.');
            }
             if (error instanceof BadRequestException || error instanceof NotFoundException) {
                 throw error;
             }
            this.logger.error(`Failed to submit creation registration for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to submit creation registration.');
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

    async getCreationProfile(userId: string): Promise<Creation | null> {
        this.logger.log(`Fetching creation profile for user ID: ${userId}`);
        const contestRegistration = await this.prisma.contest.findUnique({
            where: { userId: userId },
        });

        if (!contestRegistration) {
            this.logger.log(`No contest registration found for user ID: ${userId}`);
            return null;
        }

        const creation = await this.prisma.creation.findUnique({
            where: { contestId: contestRegistration?.id },
            include: {contest: true},
        });
        return creation;
    }

    async getAllInternal(): Promise<Contest[]> {
        this.logger.log(`Fetching all Internal Contest Participant`);
        const allInternalContest = await this.prisma.contest.findMany({
            where: { 
                submitted: true,
                user: {
                    type: 'INTERNAL',
                },
            },
            include:{
                user: true,
                admin: true,
            }
        });

        return allInternalContest;
    }

    async getAllExternal(): Promise<Contest[]> {
        this.logger.log(`Fetching all External Contest Participant`);
        const allInternalContest = await this.prisma.contest.findMany({
            where: { 
                submitted: true,
                user: {
                    type: 'EXTERNAL',
                },
            },
            include:{
                user: true,
                admin: true,
            }
        });

        return allInternalContest;
    }

    async validate(id: string, updateTalkshowDto: Prisma.ContestUpdateInput, adminId: string) {
        return this.prisma.contest.update({
            where: {
                id,
            },
            data: {
                ...updateTalkshowDto,
                admin: {              // Use the relation field name 'admin'
                    connect: {
                        id: adminId   // Connect to the Admin record by its id
                    }
                }
            },
            include: {
                admin: true,
            }
        });
    }
}