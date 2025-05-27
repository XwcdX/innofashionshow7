import { Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { Prisma, Workshop, UserType, Category, Creation } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkshopDraftDto } from './workshops.controller';

@Injectable()
export class WorkshopsService {
  private readonly logger = new Logger(WorkshopsService.name);
  constructor(private readonly prisma: PrismaService) { }

  async create(createWorkshopDto: Prisma.WorkshopCreateInput) {
    return this.prisma.workshop.create({
      data: createWorkshopDto
    });
  }

  async findAll() {
    return this.prisma.workshop.findMany();
  }

  async findAllPetra() {
    return this.prisma.workshop.findMany({
      where: {
        // asal: 'Petra'
      }
    });
  }

  async findAllUmum() {
    return this.prisma.workshop.findMany({
      where: {
        // asal: 'Umum'
      }
    });
  }

  async getWorkshopProfile(userId: string): Promise<Workshop | null> {
    this.logger.log(`Fetching workshop profile for user ID: ${userId}`);
    const workshopRegistration = await this.prisma.workshop.findUnique({
        where: { userId: userId },
        include: {
          user:true,
        }
    });

    if (!workshopRegistration) {
        this.logger.log(`No contest registration found for user ID: ${userId}`);
        return null;
    }
    return workshopRegistration;
  }

  async saveDraft(userId: string, dto: WorkshopDraftDto): Promise<Workshop | null> {
    this.logger.log(`Attempting to save workshops draft for user ID: ${userId}`);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        this.logger.warn(`User not found for ID: ${userId} while saving draft.`);
        throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const updateUserData: Prisma.UserUpdateInput = {
        ...(dto.name !== undefined && { name: dto.name }),
        updatedAt: new Date(),
    };
    const updateData: Prisma.WorkshopUpdateInput = {
        ...(dto.proofOfPayment !== undefined && { proofOfPayment: dto.proofOfPayment }),
        ...(dto.idline !== undefined && { idline: dto.idline }),
        ...(dto.wa !== undefined && { wa: dto.wa }),
        ...(user.type === UserType.INTERNAL && dto.nrp !== undefined && { nrp: dto.nrp }),
        ...(user.type === UserType.INTERNAL && dto.jurusan !== undefined && { jurusan: dto.jurusan }),
        updated_at: new Date(),
    };
    if (Object.keys(updateData).length <= 1) {
        this.logger.log(`No actual draft data provided to update for user ${userId}. Skipping workshop update.`);
        return this.prisma.workshop.findUnique({ where: { userId } });
    }

    const createData: Prisma.WorkshopCreateInput = {
        user: { connect: { id: userId } },
        wa: dto.wa ?? null,
        idline: dto.idline ?? null,
        proofOfPayment: dto.proofOfPayment ?? null,
        nrp: (user.type === UserType.INTERNAL && dto.nrp !== undefined) ? dto.nrp : null,
        jurusan: (user.type === UserType.INTERNAL && dto.jurusan !== undefined) ? dto.jurusan : null,
        valid: false,
    };

    try {
        this.logger.log(`Upserting workshop draft for user ${userId}`);
        if (dto.name !== undefined) {
          await this.prisma.user.update({
            where: { id: userId },
            data: updateUserData,
          });
        }
        const savedWorkshop = await this.prisma.workshop.upsert({
            where: { userId: userId },
            create: createData,
            update: updateData,
        });
        this.logger.log(`Successfully saved contest draft for user ID: ${userId}`);
        return savedWorkshop;
    } catch (error) {
        this.logger.error(`Failed to save workshops draft for user ${userId}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Failed to save workshop draft data.');
    }
  }

  async submitWorkshop(userId: string, dto: WorkshopDraftDto): Promise<Workshop> {
    this.logger.log(`Attempting final workshop submission for user ID: ${userId}`);
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
        if (!dto.jurusan) missingFields.push('Major');
    }
    if (!dto.wa) missingFields.push('Whatsapp');
    if (!dto.idline) missingFields.push('ID Line');
    if (!dto.proofOfPayment) missingFields.push('Proof of Payment');

    if (missingFields.length > 0) {
        const errorMessage = `Missing required fields for ${user.type} user contest submission: ${missingFields.join(', ')}.`;
        this.logger.warn(`Submission validation failed for user ${userId}: ${errorMessage}`);
        throw new BadRequestException(errorMessage);
    }
    // --- End Validation ---

    const updateData: Prisma.WorkshopUpdateInput = {
        idline: dto.idline,
        wa: dto.wa,
        proofOfPayment: dto.proofOfPayment,
        valid: false,
        nrp: user.type === UserType.INTERNAL ? dto.nrp : null,
        jurusan: user.type === UserType.INTERNAL ? dto.jurusan : null,
        updated_at: new Date(),
        submitted: true,
    };

    const createData: Prisma.WorkshopCreateInput = {
        user: { connect: { id: userId } },
        idline: dto.idline,
        wa: dto.wa,
        proofOfPayment: dto.proofOfPayment,
        valid: false,
        nrp: user.type === UserType.INTERNAL ? dto.nrp : null,
        jurusan: user.type === UserType.INTERNAL ? dto.jurusan : null,
        submitted: true,
    };

    try {
        this.logger.log(`Upserting final workshop submission for user ${userId}`);
        if (dto.name !== undefined) {
          await this.prisma.user.update({
            where: { id: userId },
            data: updateUserData,
          });
        }
        const submittedWorkshop = await this.prisma.workshop.upsert({
            where: { userId: userId },
            create: createData,
            update: updateData,
        });
        this.logger.log(`Successfully submitted contest registration for user ID: ${userId}`);
        return submittedWorkshop;
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            this.logger.error(`Prisma error during workshop submission for user ${userId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Database error during workshop submission.');
        }
         if (error instanceof BadRequestException || error instanceof NotFoundException) {
             throw error;
         }
        this.logger.error(`Failed to submit contest registration for user ${userId}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Failed to submit contest registration.');
    }
  }

  async getValidate(userId: string): Promise<{ validateStatus: boolean | null } | null> {
    this.logger.log(`Fetching valid status for user ID: ${userId}`);
    // Fetch only the 'category' field from the contest record
    const workshopRegistration = await this.prisma.workshop.findUnique({
        where: { userId: userId },
        select: {
            valid: true,  // Only select the 'category' field
        },
    });

    if (!workshopRegistration) {
        this.logger.log(`No valid status found for user ID: ${userId}`);
        return {validateStatus: null};
    }

    return { validateStatus: workshopRegistration.valid }; 
  }

  async getSubmitted(userId: string): Promise<{ submittedStatus: boolean | null } | null> {
      this.logger.log(`Fetching submitted status for user ID: ${userId}`);
      // Fetch only the 'category' field from the contest record
      const workshopRegistration = await this.prisma.workshop.findUnique({
          where: { userId: userId },
          select: {
              submitted: true,  // Only select the 'category' field
          },
      });

      if (!workshopRegistration) {
          this.logger.log(`No submitted status found for user ID: ${userId}`);
          return null;
      }

      return { submittedStatus: workshopRegistration.submitted }; 
  }

  async validatePembayaran(id: string, updateWorkshopDto: Prisma.WorkshopUpdateInput) {
    return this.prisma.workshop.update({
      where: {
        id,
      },
      data: updateWorkshopDto,
    });
  }

  async findOne(id: string) {
    return this.prisma.workshop.findUnique({
      where:{
        id,
      }
    });
  }

  async update(id: string, updateWorkshopDto: Prisma.WorkshopUpdateInput) {
    return this.prisma.workshop.update({
      where: {
        id,
      },
      data: updateWorkshopDto,
    });
  }

  async remove(id: string) {
    return this.prisma.workshop.delete({
      where: {
        id,
      },
    });
  }
}
