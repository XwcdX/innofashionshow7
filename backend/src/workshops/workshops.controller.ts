import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe, Param, Patch, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAuthGuardAdmin } from '../admin-auth/jwt-auth.guard';
import { WorkshopsService } from './workshops.service';
import { Request } from 'express';
import { User, Prisma } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';

export class WorkshopDraftDto {
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
  @IsString()
  proofOfPayment?: string;
}

interface RequestWithUser extends Request {
  user: Pick<User, 'id' | 'email' | 'name' | 'type'>;
}
@Controller('workshop')
export class WorkshopsController {
  private readonly logger = new Logger(WorkshopsController.name);
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

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getWorkshopProfile(@Req() req: RequestWithUser) {
    const userId = req.user.id;
    this.logger.log(`Fetching contest profile data for user ID: ${userId}`);
    const profileData = await this.workshopsService.getWorkshopProfile(userId);
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
      @Body() draftDto: WorkshopDraftDto,
  ) {
      const userId = req.user.id;
      this.logger.log(`Received contest draft save request from user ID: ${userId}`);
      await this.workshopsService.saveDraft(userId, draftDto);
      return { message: 'Contest draft saved successfully.' };
  }

  @Post('submit')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async submitWorkshop(
      @Req() req: RequestWithUser,
      @Body() submitDto: WorkshopDraftDto,
  ) {
      const userId = req.user.id;
      this.logger.log(`Received Workshop submission from user ID: ${userId}`);
      const result = await this.workshopsService.submitWorkshop(userId, submitDto);
      return { message: 'Workshop registration submitted successfully.', data: result };
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
