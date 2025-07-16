// backend/src/work/work.service.ts
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkDto } from './dto/create-work.dto';

@Injectable()
export class WorkService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateWorkDto) {
    return this.prisma.work.create({ data: dto });
  }

  findAll() {
    return this.prisma.work.findMany({ orderBy: { voteCount: 'desc' } });
  }

  async checkUserVoteStatus(userId: string) {
    const vote = await this.prisma.vote.findUnique({ where: { userId } });
    return { hasVoted: !!vote };
  }

  async vote(workId: string, userId: string) {
    const existingVote = await this.prisma.vote.findUnique({ where: { userId } });
    if (existingVote) throw new ForbiddenException('You have already voted.');

    return this.prisma.$transaction(async (tx) => {
      await tx.vote.create({ data: { userId, workId } });
      return tx.work.update({
        where: { id: workId },
        data: { voteCount: { increment: 1 } },
      });
    });
  }
}