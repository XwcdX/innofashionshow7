import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe, Param, Patch, Delete } from '@nestjs/common';
import { TalkshowsService } from './talkshows.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAuthGuardAdmin } from '../admin-auth/jwt-auth.guard';
import { Request } from 'express';
import { User, Prisma } from '@prisma/client';
import { IsOptional, IsString, IsEnum } from 'class-validator';
export enum TalkshowType {
  TALKSHOW_1 = 'TALKSHOW_1',
  TALKSHOW_2 = 'TALKSHOW_2',
  WEBINAR = 'WEBINAR',
}
export class TalkshowDraftDto {
  @IsOptional()
  @IsString()
  wa?: string;

  @IsOptional()
  @IsString()
  idline?: string;

  @IsOptional()
  @IsString()
  jurusan?: string;

  @IsOptional()
  @IsString()
  nrp?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(TalkshowType)
  category?: TalkshowType;
}
interface RequestWithUser extends Request {
  user: Pick<User, 'id' | 'email' | 'name' | 'type'>;
}
@Controller('talkshow')
export class TalkshowsController {
  constructor(private readonly talkshowsService: TalkshowsService) {}
  private readonly logger = new Logger(TalkshowsController.name);

  @Post()
  create(@Body() createTalkshowDto: Prisma.TalkshowCreateInput) {
    return this.talkshowsService.create(createTalkshowDto);
  }

  @Get()
  findAll() {
    return this.talkshowsService.findAll();
  }
  
  @Get('petra')
  @UseGuards(JwtAuthGuardAdmin)
  @HttpCode(HttpStatus.OK)
  findAllPetra() {
    return this.talkshowsService.findAllPetra();
  }

  @Get('umum')
  @UseGuards(JwtAuthGuardAdmin)
  @HttpCode(HttpStatus.OK)
  findAllUmum() {
    return this.talkshowsService.findAllUmum();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getWorkshopProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    this.logger.log(`Fetching contest profile data for user ID: ${userId}`);
    const profileData = await this.talkshowsService.getTalkshowProfile(userId);
    if (!profileData) {
        return {};
    }
    return profileData;
  }

  @Post('draft')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async saveDraft(
      @Req() req: RequestWithUser,
      @Body() draftDto: TalkshowDraftDto,
  ) {
      const userId = req.user.id;
      this.logger.log(`Received Talkshow draft save request from user ID: ${userId}`);
      await this.talkshowsService.saveDraft(userId, draftDto);
      return { message: 'Talkshow draft saved successfully.' };
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async submitWorkshop(
      @Req() req: RequestWithUser,
      @Body() submitDto: TalkshowDraftDto,
  ) {
      const userId = req.user.id;
      this.logger.log(`Received Workshop submission from user ID: ${userId}`);
      const result = await this.talkshowsService.submit(userId, submitDto);
      return { message: 'Workshop registration submitted successfully.', data: result };
  }

  // @Post('validate/:id') // This defines the route to handle '/talkshows/validate/{id}'
  // validatePembayaran(@Param('id') id: string, @Body() updateTalkshowDto: Prisma.TalkshowUpdateInput) {
  //   // Pass the ID and the update data to the service
  //   return this.talkshowsService.validatePembayaran(id, updateTalkshowDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.talkshowsService.findOne(id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTalkshowDto: Prisma.TalkshowUpdateInput) {
  //   return this.talkshowsService.update(id, updateTalkshowDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.talkshowsService.remove(id);
  // }
}
