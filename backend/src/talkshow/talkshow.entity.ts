import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

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

    @Column({ type: 'int', default: 0 }) // default 0 = belum bayar
    status_pembayaran: number;

    // New: created_at timestamp
    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    // New: updated_at timestamp
    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;
}
