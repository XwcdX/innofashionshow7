import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TalkshowsService } from './talkshows.service';
import { Prisma } from '@prisma/client'

@Controller('talkshows')
export class TalkshowsController {
  constructor(private readonly talkshowsService: TalkshowsService) {}

  @Post()
  create(@Body() createTalkshowDto: Prisma.TalkshowCreateInput) {
    return this.talkshowsService.create(createTalkshowDto);
  }

  @Get()
  findAll() {
    return this.talkshowsService.findAll();
  }

  @Get('petra')
  findAllPetra() {
    return this.talkshowsService.findAllPetra();
  }

  @Get('umum')
  findAllUmum() {
    return this.talkshowsService.findAllUmum();
  }

  @Post('validate/:id') // This defines the route to handle '/talkshows/validate/{id}'
  validatePembayaran(@Param('id') id: string, @Body() updateTalkshowDto: Prisma.TalkshowUpdateInput) {
    // Pass the ID and the update data to the service
    return this.talkshowsService.validatePembayaran(id, updateTalkshowDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.talkshowsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTalkshowDto: Prisma.TalkshowUpdateInput) {
    return this.talkshowsService.update(id, updateTalkshowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.talkshowsService.remove(id);
  }
}
