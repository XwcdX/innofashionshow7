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
        return await this.talkshowsRepository.find({select: ['nama', 'nrp', 'jurusan', 'wa', 'idline', 'domisili', 'asal']}); // fetch from db
    }

    async findPetra(): Promise<Pick<Talkshow, 'nama' | 'nrp' | 'jurusan' | 'wa' | 'idline'>[]> {
        const result = await this.talkshowsRepository.find({
            select: ['id', 'nama', 'nrp', 'jurusan', 'wa', 'idline', 'status_pembayaran'], 
            where: { asal: AsalType.Petra }
        });
    
        // Re-order the columns
        return result.map(item => ({
            id: item.id,
            nama: item.nama,
            nrp: item.nrp,
            jurusan: item.jurusan,
            wa: item.wa,
            idline: item.idline,
            status_pembayaran: item.status_pembayaran
        }));
    }

    async findUmum(): Promise<Talkshow[]> {
        return await this.talkshowsRepository.find({
            select: ['id', 'nama', 'domisili', 'wa', 'idline', 'status_pembayaran'], 
            where: { asal: AsalType.Umum } 
        });
    }

    // Update the payment status (status_pembayaran)
    async updateStatusPembayaran(id: string, validate: boolean): Promise<boolean> {
        // Find the talkshow by its unique identifier (id)
        const talkshow = await this.talkshowsRepository.findOne({
            where: { id }, // Correct way to search by id
        });
    
        if (!talkshow) {
            throw new Error('Talkshow not found');
        }
    
        // Update the status_pembayaran field (set to 1 for validated, 0 for not validated)
        talkshow.status_pembayaran = validate ? 1 : 0;
    
        // Save the updated talkshow entity back to the database
        await this.talkshowsRepository.save(talkshow);
    
        return true; // Return true if update was successful
    }
    
}
