import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum AsalType {
    Petra = 'Petra',
    Umum = 'Umum',
}

@Entity('talkshows') // table name
export class Talkshow {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: AsalType })
    asal: AsalType;

    @Column()
    nama: string;

    @Column()
    wa: string;

    @Column()
    idline: string;
    
    @Column({ nullable: true })
    domisili: string;
    
    @Column({ nullable: true })
    nrp: string;
    
    @Column({ nullable: true })
    jurusan: string;
}
