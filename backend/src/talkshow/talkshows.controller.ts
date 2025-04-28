import { Controller, Get, Post, Body } from '@nestjs/common';
import { TalkshowsService } from './talkshows.service';

@Controller('talkshows')
export class TalkshowsController {
    constructor(private readonly talkshowsService: TalkshowsService) {}

    @Get()
    async findAll() {
        return await this.talkshowsService.findAll();
    }

    @Get('petra')
    async findPetra() {
        return await this.talkshowsService.findPetra();
    }

    @Get('umum')
    async findUmum() {
        return await this.talkshowsService.findUmum();
    }

    @Post('validate')
    async validatePayment(@Body() body: { id: string; validate: boolean }) {
        const { id, validate } = body;

        try {
        const updated = await this.talkshowsService.updateStatusPembayaran(id, validate);
        
        if (updated) {
            return { message: 'Payment status updated successfully!' };
        }
        
        return { message: 'Failed to update payment status' };
        } catch (error) {
            console.error('Error validating payment:', error);
            throw new Error('Something went wrong during validation');
        }
    }
}
