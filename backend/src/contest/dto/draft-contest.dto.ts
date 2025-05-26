import {
    IsString,
    IsOptional,
    IsEnum,
    IsInt,
    Min,
    Matches,
    MaxLength,
    IsNotEmpty,
    IsDefined,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Category {
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
}

export class DraftContestDto {
    @IsOptional()
    @IsEnum(Category, { always: true })
    category?: Category;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ always: true, message: 'Age must be a whole number.' })
    age?: number;

    @IsOptional()
    @IsString({ always: true })
    @MaxLength(25, { always: true })
    whatsapp?: string;

    @IsOptional()
    @IsString({ always: true })
    proofOfPayment?: string;

    @IsOptional()
    @IsString({ always: true }) ktmPath?: string;

    @IsOptional()
    @IsString({ always: true }) idCardPath?: string;

    @IsOptional()
    @IsString({ always: true })
    nrp?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ always: true, message: 'Batch must be a whole number.' })
    batch?: number;

    @IsOptional()
    @IsString({ always: true })
    major?: string;

    @IsOptional()
    @IsString({ always: true })
    instance?: string;

    @IsOptional()
    @IsString()
    name?: string;
}