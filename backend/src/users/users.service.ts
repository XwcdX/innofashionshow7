import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DraftUserDto } from './dto/draft-user.dto';
import { User, UserType, Prisma } from '@prisma/client';

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

    async submitUser(userId: string, dto: DraftUserDto): Promise<User> {
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