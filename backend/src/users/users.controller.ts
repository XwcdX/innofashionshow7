import { Controller, Get, Req, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
    user: Pick<User, 'id' | 'email' | 'name' | 'type'>;
}


@Controller('users')
export class UsersController {
    private readonly logger = new Logger(UsersController.name);

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getProfile(@Req() req: RequestWithUser) {
        this.logger.log(`Fetching profile for user: ${req.user.email}`);
        const { id, email, name, type } = req.user;
        return { id, email, name, type };
    }
}