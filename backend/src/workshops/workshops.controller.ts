import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WorkshopsService } from './workshops.service';
import { Prisma } from '@prisma/client'

@Controller('workshops')
export class WorkshopsController {
  constructor(private readonly workshopsService: WorkshopsService) {}

  @Post()
  create(@Body() createWorkshopDto: Prisma.WorkshopCreateInput) {
    return this.workshopsService.create(createWorkshopDto);
  }

  @Get()
  findAll() {
    return this.workshopsService.findAll();
  }

  @Get('petra')
  findAllPetra() {
    return this.workshopsService.findAllPetra();
  }

  @Get('umum')
  findAllUmum() {
    return this.workshopsService.findAllUmum();
  }

  @Post('validate/:id') // This defines the route to handle '/talkshows/validate/{id}'
  validatePembayaran(@Param('id') id: string, @Body() updateWorkshopDto: Prisma.WorkshopUpdateInput) {
    // Pass the ID and the update data to the service
    return this.workshopsService.validatePembayaran(id, updateWorkshopDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workshopsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkshopDto: Prisma.WorkshopUpdateInput) {
    return this.workshopsService.update(id, updateWorkshopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workshopsService.remove(id);
  }
}
