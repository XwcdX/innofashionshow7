import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client'
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class WorkshopsService {
  constructor(private readonly databaseService: DatabaseService){}

  async create(createWorkshopDto: Prisma.WorkshopCreateInput) {
    return this.databaseService.workshop.create({
      data: createWorkshopDto
    });
  }

  async findAll() {
    return this.databaseService.workshop.findMany();
  }

  async findAllPetra() {
    return this.databaseService.workshop.findMany({
      where: {
        asal: 'Petra'
      }
    });
  }

  async findAllUmum() {
    return this.databaseService.workshop.findMany({
      where: {
        asal: 'Umum'
      }
    });
  }

  async validatePembayaran(id: string, updateWorkshopDto: Prisma.WorkshopUpdateInput) {
    return this.databaseService.workshop.update({
      where: {
        id,
      },
      data: updateWorkshopDto,
    });
  }

  async findOne(id: string) {
    return this.databaseService.workshop.findUnique({
      where:{
        id,
      }
    });
  }

  async update(id: string, updateWorkshopDto: Prisma.WorkshopUpdateInput) {
    return this.databaseService.workshop.update({
      where: {
        id,
      },
      data: updateWorkshopDto,
    });
  }

  async remove(id: string) {
    return this.databaseService.workshop.delete({
      where: {
        id,
      },
    });
  }
}
