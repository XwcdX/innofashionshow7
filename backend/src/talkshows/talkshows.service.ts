import {  Injectable, NotFoundException, InternalServerErrorException, Logger, BadRequestException  } from '@nestjs/common';
import { Prisma, Talkshow, UserType, Category, Creation } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';
import { TalkshowDraftDto } from './talkshows.controller';

type TalkshowProfile= Talkshow & {
  talk1Submit: boolean;
  talk2Submit: boolean;
  webinarSubmit: boolean;
};
@Injectable()
export class TalkshowsService {
  constructor(private readonly prisma: DatabaseService){}
  private readonly logger = new Logger(TalkshowsService.name);

  async create(createTalkshowDto: Prisma.TalkshowCreateInput) {
    return this.prisma.talkshow.create({
      data: createTalkshowDto
    });
  }

  async findAll() {
    return this.prisma.talkshow.findMany();
  }

  async getTalkshowProfile(userId: string): Promise<TalkshowProfile | null> {
    this.logger.log(`Fetching talkshow profile for user ID: ${userId}`);

    const talkshowRegistrations = await this.prisma.talkshow.findMany({
      where: { userId },
      include: {
        user: true,
      },
    });

    if (talkshowRegistrations.length === 0) {
      this.logger.log(`No talkshow registrations found for user ID: ${userId}`);
      return null;
    }

    // Initialize flags
    let talk1Submit = false;
    let talk2Submit = false;
    let webinarSubmit = false;

    // Determine submission status
    for (const reg of talkshowRegistrations) {
      if (reg.type === 'TALKSHOW_1' && reg.submitted) {
        talk1Submit = true;
      }
      if (reg.type === 'TALKSHOW_2' && reg.submitted) {
        talk2Submit = true;
      }
      if (reg.type === 'WEBINAR' && reg.submitted) {
        webinarSubmit = true;
      }
    }

    // Pick one record to return — for example, the first submitted one or fallback to the first record
    const base = talkshowRegistrations.find(r => r.submitted) || talkshowRegistrations[0];

    // Return enriched result
    return {
      ...base,
      talk1Submit,
      talk2Submit,
      webinarSubmit,
    };
  }

  async saveDraft(userId: string, dto: TalkshowDraftDto): Promise<Talkshow | null> {
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
    const updateData: Prisma.TalkshowUpdateInput = {
        ...(dto.idline !== undefined && { idline: dto.idline }),
        ...(dto.wa !== undefined && { wa: dto.wa }),
        ...(user.type === UserType.INTERNAL && dto.nrp !== undefined && { nrp: dto.nrp }),
        ...(user.type === UserType.INTERNAL && dto.jurusan !== undefined && { jurusan: dto.jurusan }),
        updated_at: new Date(),
    };
    if (Object.keys(updateData).length <= 1) {
        this.logger.log(`No actual draft data provided to update for user ${userId}. Skipping workshop update.`);
        return null;
    }

    if (!dto.category) {
      this.logger.log(`No actual draft data provided to update for user ${userId}. Skipping workshop update.`);
      return null;
    }

    const createData: Prisma.TalkshowCreateInput = {
        user: { connect: { id: userId } },
        wa: dto.wa ?? null,
        idline: dto.idline ?? null,
        nrp: (user.type === UserType.INTERNAL && dto.nrp !== undefined) ? dto.nrp : null,
        jurusan: (user.type === UserType.INTERNAL && dto.jurusan !== undefined) ? dto.jurusan : null,
        type: dto.category
    };

    try {
        this.logger.log(`Upserting workshop draft for user ${userId}`);
        if (dto.name !== undefined) {
          await this.prisma.user.update({
            where: { id: userId },
            data: updateUserData,
          });
        }
        const savedTalkshow = await this.prisma.talkshow.upsert({
            where: { userId: userId },
            create: createData,
            update: updateData,
        });
        this.logger.log(`Successfully saved contest draft for user ID: ${userId}`);
        return savedTalkshow;
    } catch (error) {
        this.logger.error(`Failed to save workshops draft for user ${userId}: ${error.message}`, error.stack);
        throw new InternalServerErrorException('Failed to save workshop draft data.');
    }
  }

  async submit(userId: string, dto: TalkshowDraftDto): Promise<Talkshow> {
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
    if (!dto.category) missingFields.push('Category');

    if (missingFields.length > 0) {
        const errorMessage = `Missing required fields for ${user.type} user contest submission: ${missingFields.join(', ')}.`;
        this.logger.warn(`Submission validation failed for user ${userId}: ${errorMessage}`);
        throw new BadRequestException(errorMessage);
    }
    // --- End Validation ---

    const updateData: Prisma.TalkshowUpdateInput = {
        idline: dto.idline,
        wa: dto.wa,
        nrp: user.type === UserType.INTERNAL ? dto.nrp : null,
        jurusan: user.type === UserType.INTERNAL ? dto.jurusan : null,
        updated_at: new Date(),
        submitted: true,
        type: dto.category
    };

    if (!dto.category) throw new BadRequestException('Category not found');;

    const createData: Prisma.TalkshowCreateInput = {
        user: { connect: { id: userId } },
        idline: dto.idline,
        wa: dto.wa,
        nrp: user.type === UserType.INTERNAL ? dto.nrp : null,
        jurusan: user.type === UserType.INTERNAL ? dto.jurusan : null,
        submitted: true,
        type: dto.category
    };

    try {
        this.logger.log(`Upserting final workshop submission for user ${userId}`);
        if (dto.name !== undefined) {
          await this.prisma.user.update({
            where: { id: userId },
            data: updateUserData,
          });
        }
        const submittedTalkshow = await this.prisma.talkshow.upsert({
            where: { userId: userId },
            create: createData,
            update: updateData,
        });
        this.logger.log(`Successfully submitted contest registration for user ID: ${userId}`);
        return submittedTalkshow;
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

  async findOne(id: string) {
    return this.prisma.talkshow.findUnique({
      where:{
        id,
      }
    });
  }

  async update(id: string, updateTalkshowDto: Prisma.TalkshowUpdateInput) {
    return this.prisma.talkshow.update({
      where: {
        id,
      },
      data: updateTalkshowDto,
    });
  }

  async remove(id: string) {
    return this.prisma.talkshow.delete({
      where: {
        id,
      },
    });
  }
}
