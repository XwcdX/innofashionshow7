import { Controller, Get } from '@nestjs/common';
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
}
