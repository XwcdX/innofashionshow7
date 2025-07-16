// backend/src/work/work.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { WorkService } from './work.service';
import { CreateWorkDto } from './dto/create-work.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('work')
export class WorkController {
  constructor(private readonly workService: WorkService) {}

  // API 1: GET /work -> Ambil semua karya (Publik)
  @Get()
  findAll() { return this.workService.findAll(); }

  // Endpoint bantuan untuk cek status vote user (Harus Login)
  @UseGuards(JwtAuthGuard)
  @Get('vote/status')
  checkVoteStatus(@Request() req) { return this.workService.checkUserVoteStatus(req.user.id); }

  // API 2: POST /work/vote/:id -> Vote sebuah karya (Harus Login)
  @UseGuards(JwtAuthGuard)
  @Post('vote/:id')
  vote(@Param('id') workId: string, @Request() req) { return this.workService.vote(workId, req.user.id); }

  // API 3: POST /work -> Admin menambah karya (Harus Login)
  @UseGuards(JwtAuthGuard) // Seharusnya ada AdminGuard juga
  @Post()
  create(@Body() createWorkDto: CreateWorkDto) { return this.workService.create(createWorkDto); }
}