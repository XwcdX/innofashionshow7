import { Body, Controller, Get, HttpCode, HttpStatus, Logger, NotFoundException, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { DraftUserDto } from './dto/draft-user.dto';
import { Request } from 'express';
import { User, Internal, External } from '@prisma/client';
import { SubmitUserDto } from './dto/submit-user.dto';

interface AuthenticatedUser extends User {
    internalProfile?: Internal | null;
    externalProfile?: External | null;
}

interface RequestWithUser extends Request {
    user: AuthenticatedUser;
}

@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    constructor(private readonly usersService: UsersService) { }
    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Req() req: RequestWithUser) {
        this.logger.log(`Fetching profile for user: ${req.user.email}`);
        const { id, email, name, type, category, age, whatsapp, proofOfPayment, valid, internalProfile, externalProfile } = req.user;
        return { id, email, name, type, category, age, whatsapp, proofOfPayment, valid, internalProfile, externalProfile };
    }

    @Post('draft')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async saveDraft(
        @Req() req: RequestWithUser,
        @Body() draftDto: DraftUserDto,
    ) {
        const userId = req.user.id;
        this.logger.log(`Received draft save request from user ID: ${userId}`);
        this.logger.debug(`Draft DTO: ${JSON.stringify(draftDto)}`);

        await this.usersService.saveDraft(userId, draftDto);

        return { message: 'Draft saved successfully.' };
    }

    @Post('submit')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async submitUser(
        @Req() req: RequestWithUser,
        @Body() submitDto: SubmitUserDto,
    ) {
        const userId = req.user.id;
        this.logger.log(`Received draft save request from user ID: ${userId}`);
        this.logger.debug(`Draft DTO: ${JSON.stringify(submitDto)}`);

        await this.usersService.submitUser(userId, submitDto);

        return { message: 'User profile submitted successfully.' };
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getUserProfile(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        this.logger.log(`Fetching profile data for user ID: ${userId}`);
        try {
            const profileData = await this.usersService.getFormattedUserProfile(userId);
            if (!profileData) {
                 this.logger.log(`No existing profile data found for user ${userId}. Returning default structure.`);
                 return {};
            }
            return profileData;
        } catch (error) {
            if (error instanceof NotFoundException) {
                this.logger.warn(`User ${userId} not found during profile fetch.`);
                throw error;
            }
            this.logger.error(`Error fetching profile for user ${userId}: ${error.message}`, error.stack);
             return {};
        }
    }
}