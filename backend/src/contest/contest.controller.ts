import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContestService } from './contest.service';
import { DRAFT_GROUP, DraftContestDto } from './dto/draft-contest.dto';
import { SubmitContestDto } from './dto/submit-contest.dto';
import { Request } from 'express';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
    user: Pick<User, 'id' | 'email' | 'name' | 'type'>;
}

@Controller('contest')
@UseGuards(JwtAuthGuard)
export class ContestController {
    private readonly logger = new Logger(ContestController.name);

    constructor(private readonly contestService: ContestService) {}

    @Post('draft')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe({ transform: true, whitelist: true, groups: [DRAFT_GROUP] }))
    async saveDraft(
        @Req() req: RequestWithUser,
        @Body() draftDto: DraftContestDto,
    ) {
        const userId = req.user.id;
        this.logger.log(`Received contest draft save request from user ID: ${userId}`);
        await this.contestService.saveDraft(userId, draftDto);
        return { message: 'Contest draft saved successfully.' };
    }

    @Post('submit')
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
}