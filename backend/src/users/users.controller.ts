import { Body, Controller, Get, Post, Param, HttpCode, HttpStatus, Logger, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { DraftUserDto } from './dto/draft-user.dto';
import { Request } from 'express';
import { User, Internal, External } from '@prisma/client';
import { Prisma } from '@prisma/client'

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
        @Body() draftDto: DraftUserDto,
    ) {
        const userId = req.user.id;
        this.logger.log(`Received draft save request from user ID: ${userId}`);
        this.logger.debug(`Draft DTO: ${JSON.stringify(draftDto)}`);

        await this.usersService.submitUser(userId, draftDto);

        return { message: 'Draft saved successfully.' };
    }

    @Get('petra')
    findAllPetra() {
        return this.usersService.findAllPetra();
    }

    @Get('umum')
    findAllUmum() {
        return this.usersService.findAllUmum();
    }

  @Post('validate/:id') // This defines the route to handle '/talkshows/validate/{id}'
    validatePembayaran(@Param('id') id: string, @Body() updateTalkshowDto: Prisma.UserUpdateInput) {
        // Pass the ID and the update data to the service
        return this.usersService.validatePembayaran(id, updateTalkshowDto);
    }
}