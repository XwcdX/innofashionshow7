import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DraftUserDto } from './dto/draft-user.dto';
import { Prisma, User, UserType } from '@prisma/client';
import { SubmitUserDto } from './dto/submit-user.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    constructor(private readonly prisma: PrismaService) { }

    async saveDraft(userId: string, dto: DraftUserDto): Promise<User> {
        this.logger.log(`Attempting to save draft for user ID: ${userId}`);

        try {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
            });

            if (!user) {
                this.logger.warn(`User not found for ID: ${userId}`);
                throw new NotFoundException(`User with ID ${userId} not found.`);
            }

            const {
                category,
                age,
                whatsapp,
                proofPath,
                ktmPath,
                idCardPath,
                nrp,
                batch,
                major,
                instance,
            } = dto;

            const userDataUpdate: any = {};
            if (category !== undefined) userDataUpdate.category = category;
            if (age !== undefined) userDataUpdate.age = age;
            if (whatsapp !== undefined) userDataUpdate.whatsapp = whatsapp;
            if (proofPath !== undefined) userDataUpdate.proofOfPayment = proofPath;

            const profileData: any = {};
            if (user.type === UserType.INTERNAL) {
                const internalUpdate: any = {};
                if (nrp !== undefined) internalUpdate.nrp = nrp;
                if (batch !== undefined) internalUpdate.batch = batch;
                if (major !== undefined) internalUpdate.major = major;
                if (ktmPath !== undefined) internalUpdate.ktm = ktmPath;

                if (Object.keys(internalUpdate).length > 0) {
                    profileData.internalProfile = {
                        upsert: {
                            where: { userId: user.id },
                            create: { ...internalUpdate },
                            update: internalUpdate,
                        },
                    };
                }

            } else if (user.type === UserType.EXTERNAL) {
                const externalUpdate: any = {};
                if (instance !== undefined) externalUpdate.instance = instance;
                if (idCardPath !== undefined) externalUpdate.idCard = idCardPath;

                if (Object.keys(externalUpdate).length > 0) {
                    profileData.externalProfile = {
                        upsert: {
                            where: { userId: user.id },
                            create: { ...externalUpdate },
                            update: externalUpdate,
                        },
                    };
                }
            }

            const finalUpdateData = { ...userDataUpdate, ...profileData };

            if (Object.keys(finalUpdateData).length === 0) {
                this.logger.log(`No draft data provided for user ${userId}. Skipping update.`);
                return user;
            }

            this.logger.log(`Updating draft for user ${userId} with data: ${JSON.stringify(finalUpdateData)}`);

            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: finalUpdateData,
                include: {
                    internalProfile: true,
                    externalProfile: true,
                },
            });

            this.logger.log(`Successfully saved draft for user ID: ${userId}`);
            return updatedUser;

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to save draft for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to save draft data.');
        }
    }

    async submitUser(userId: string, dto: SubmitUserDto): Promise<User> {
        this.logger.log(`Attempting final profile submission for user ID: ${userId}`);

        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            this.logger.warn(`User not found for ID: ${userId} during submission attempt.`);
            throw new NotFoundException(`User with ID ${userId} not found.`);
        }

        const missingFields: string[] = [];
        if (user.type === UserType.INTERNAL) {
            if (!dto.nrp) missingFields.push('NRP');
            if (!dto.batch) missingFields.push('Batch');
            if (!dto.major) missingFields.push('Major');
            if (!dto.ktmPath) missingFields.push('KTM Path (Student ID Card)');
        } else if (user.type === UserType.EXTERNAL) {
            if (!dto.instance) missingFields.push('Instance/School');
            if (!dto.idCardPath) missingFields.push('ID Card Path (KTP/Student Card)');
        }

        if (missingFields.length > 0) {
            const errorMessage = `Missing required fields for ${user.type} user: ${missingFields.join(', ')}.`;
            this.logger.warn(`Submission validation failed for user ${userId}: ${errorMessage}`);
            throw new BadRequestException(errorMessage);
        }

        // --- Prepare Update Data ---
        try {
            const userDataUpdate: any = {
                category: dto.category,
                age: dto.age,
                whatsapp: dto.whatsapp,
                proofOfPayment: dto.proofPath,
            };

            const profileData: any = {};
            if (user.type === UserType.INTERNAL) {
                profileData.internalProfile = {
                    upsert: {
                        where: { userId: user.id },
                        create: {
                            nrp: dto.nrp!,
                            batch: dto.batch!,
                            major: dto.major!,
                            ktm: dto.ktmPath!,
                        },
                        update: {
                            nrp: dto.nrp!,
                            batch: dto.batch!,
                            major: dto.major!,
                            ktm: dto.ktmPath!,
                        },
                    },
                };
            } else if (user.type === UserType.EXTERNAL) {
                profileData.externalProfile = {
                    upsert: {
                        where: { userId: user.id },
                        create: {
                            instance: dto.instance!,
                            idCard: dto.idCardPath!,
                        },
                        update: {
                            instance: dto.instance!,
                            idCard: dto.idCardPath!,
                        },
                    },
                };
            }

            const finalUpdateData = { ...userDataUpdate, ...profileData };

            this.logger.log(`Submitting profile for user ${userId} with validated data.`);

            const updatedUser = await this.prisma.user.update({
                where: { id: userId },
                data: finalUpdateData,
                include: {
                    internalProfile: true,
                    externalProfile: true,
                },
            });

            this.logger.log(`Successfully submitted profile for user ID: ${userId}`);
            return updatedUser;

        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                this.logger.error(`Prisma error during submission for user ${userId}: ${error.message}`, error.stack);
                throw new InternalServerErrorException('Database error during profile submission.');
            }
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(`Failed to submit profile for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Failed to submit profile data.');
        }
    }

    async getFormattedUserProfile(userId: string): Promise<any | null> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                internalProfile: true,
                externalProfile: true,
            },
        });

        if (!user) {
            return null;
        }

        const profileData: any = {
            category: user.category,
            age: user.age,
            whatsapp: user.whatsapp,
            proofPath: user.proofOfPayment,

            nrp: null,
            batch: null,
            major: null,
            ktmPath: null,
            instance: null,
            idCardPath: null,
        };

        if (user.type === UserType.INTERNAL && user.internalProfile) {
            profileData.nrp = user.internalProfile.nrp;
            profileData.batch = user.internalProfile.batch;
            profileData.major = user.internalProfile.major;
            profileData.ktmPath = user.internalProfile.ktm;
        } else if (user.type === UserType.EXTERNAL && user.externalProfile) {
            profileData.instance = user.externalProfile.instance;
            profileData.idCardPath = user.externalProfile.idCard;
        }
        
        return profileData;
    }
}