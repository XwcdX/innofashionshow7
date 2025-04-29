import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TalkshowsService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(createTalkshowDto: Prisma.TalkshowCreateInput) {
    return this.databaseService.talkshow.create({
      data: createTalkshowDto
    });
  }

  async findAll() {
    return this.databaseService.talkshow.findMany();
  }

  async findAllPetra() {
    return this.databaseService.talkshow.findMany({
      where: {
        asal: 'Petra'
      }
    });
  }

  async findAllUmum() {
    return this.databaseService.talkshow.findMany({
      where: {
        asal: 'Umum'
      }
    });
  }

  async validatePembayaran(id: string, updateTalkshowDto: Prisma.TalkshowUpdateInput) {
    return this.databaseService.talkshow.update({
      where: {
        id,
      },
      data: updateTalkshowDto,
    });
  }

  async findOne(id: string) {
    return this.databaseService.talkshow.findUnique({
      where:{
        id,
      }
    });
  }

  async update(id: string, updateTalkshowDto: Prisma.TalkshowUpdateInput) {
    return this.databaseService.talkshow.update({
      where: {
        id,
      },
      data: updateTalkshowDto,
    });
  }

  async remove(id: string) {
    return this.databaseService.talkshow.delete({
      where: {
        id,
      },
    });
  }
}
