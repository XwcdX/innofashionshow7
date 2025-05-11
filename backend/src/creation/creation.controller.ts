import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAuthGuardAdmin } from '../admin-auth/jwt-auth.guard';
import { CreationService } from './creation.service';
import { Request } from 'express';
import { User, Prisma } from '@prisma/client';

interface RequestWithUser extends Request {
    user: Pick<User, 'id' | 'email' | 'name' | 'type'>;
}

@Controller('creation')
export class CreationController {
    private readonly logger = new Logger(CreationController.name);

    constructor(private readonly creationService: CreationService) {}

    @Get('all')
    @UseGuards(JwtAuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
    async allCreation() {
        const allCreation = await this.creationService.allCreation();
        if (!allCreation) {
            return {};
        }
        return allCreation;
    }

    @Get('getCreationStatus')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getCreationStatus(@Req() req: RequestWithUser) {
        const userId = req.user.id;
        const creationData = await this.creationService.getCreationStatus(userId);
        if (!creationData) {
            return {};
        }
        return creationData;
    }
}