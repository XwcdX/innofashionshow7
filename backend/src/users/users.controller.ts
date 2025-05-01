import { Controller, Get, Post, Param, Body, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    getProfile(@Request() req) {
        return req.user;
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