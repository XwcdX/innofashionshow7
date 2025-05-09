import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAuthGuardAdmin } from '../admin-auth/jwt-auth.guard';
import { ContestService } from './contest.service';
import { DraftContestDto } from './dto/draft-contest.dto';
import { SubmitContestDto } from './dto/submit-contest.dto';
import { Request } from 'express';
import { User, Prisma } from '@prisma/client';

interface RequestWithUser extends Request {
    user: Pick<User, 'id' | 'email' | 'name' | 'type'>;
}

@Controller('contest')
export class ContestController {
    private readonly logger = new Logger(ContestController.name);

    constructor(private readonly contestService: ContestService) {}

    @Get('getCategory')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCategory(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        const category = await this.contestService.getCategory(userId);
        if (!category) {
             return {};
        }
        return category;
    }

    @Post('draft')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async saveDraft(
        @Req() req: RequestWithUser,
        @Body() draftDto: DraftContestDto,
    ) {
        const userId = req.user.id;
        this.logger.log(`Received contest draft save request from user ID: ${userId}`);
        await this.contestService.saveDraft(userId, draftDto);
        return { message: 'Contest draft saved successfully.' };
    }

    @Post('draftCreation')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async saveCreationDraft(
        @Req() req: RequestWithUser,
        @Body() draftDto: Prisma.CreationCreateInput,
    ) {
        const userId = req.user.id;
        this.logger.log(`Received contest draft save request from user ID: ${userId}`);
        await this.contestService.saveCreationDraft(userId, draftDto);
        return { message: 'Contest draft saved successfully.' };
    }

    @Post('submit')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async submitContest(
        @Req() req: RequestWithUser,
        @Body() submitDto: SubmitContestDto,
    ) {
        const userId = req.user.id;
        this.logger.log(`Received contest submission from user ID: ${userId}`);
        const result = await this.contestService.submitContest(userId, submitDto);
        return { message: 'Contest registration submitted successfully.', data: result };
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getContestProfile(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        this.logger.log(`Fetching contest profile data for user ID: ${userId}`);
        const profileData = await this.contestService.getContestProfile(userId);
        if (!profileData) {
             return {};
        }
        return profileData;
    }

    @Get('profileCreation')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCreationProfile(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        this.logger.log(`Fetching creation profile data for user ID: ${userId}`);
        const profileData = await this.contestService.getCreationProfile(userId);
        if (!profileData) {
            return {};
        }
        return profileData;
    }

    @Get('internal')
    @UseGuards(JwtAuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
    async getAllInternalContest() {
        this.logger.log(`Fetching all Internal Contest Participant`);
        // await this.contestService.getAllInternal();
        return this.contestService.getAllInternal();
    }

    @Get('external')
    @UseGuards(JwtAuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
    async getAllExternalContest() {
        this.logger.log(`Fetching all External Contest Participant`);
        // await this.contestService.getAllExternal();
        return this.contestService.getAllExternal();
    }

    @Post('validate/:id')
    @UseGuards(JwtAuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
    async validate(@Param('id') id: string, @Body() updateContestDto: Prisma.ContestUpdateInput) {
        this.logger.log(`Validating Contest Participant`);
        // await this.contestService.getAllExternal();
        return this.contestService.validate(id, updateContestDto);
    }
}