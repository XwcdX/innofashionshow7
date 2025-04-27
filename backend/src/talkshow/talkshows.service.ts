import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Talkshow } from './talkshow.entity';
import { AsalType } from './talkshow.entity';

@Injectable()
export class TalkshowsService {
    constructor(
        @InjectRepository(Talkshow)
        private talkshowsRepository: Repository<Talkshow>,
    ) {}

    async findAll(): Promise<Talkshow[]> {
        return await this.talkshowsRepository.find(); // fetch from db
    }

    async findPetra(): Promise<Pick<Talkshow, 'nama' | 'nrp' | 'jurusan' | 'wa' | 'idline'>[]> {
        const result = await this.talkshowsRepository.find({
            select: ['nama', 'nrp', 'jurusan', 'wa', 'idline'], 
            where: { asal: AsalType.Petra }
        });
    
        // Re-order the columns
        return result.map(item => ({
            nama: item.nama,
            nrp: item.nrp,
            jurusan: item.jurusan,
            wa: item.wa,
            idline: item.idline
        }));
    }

    async findUmum(): Promise<Talkshow[]> {
        return await this.talkshowsRepository.find({
            select: ['nama', 'domisili', 'wa', 'idline'], 
            where: { asal: AsalType.Umum } 
        });
    }
}
