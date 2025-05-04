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

export const DRAFT_GROUP = 'draft_validation_group';
export const SUBMIT_GROUP = 'submit_validation_group';

enum Category {
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
}

export class DraftContestDto {
    @IsOptional({ groups: [DRAFT_GROUP] })
    @IsDefined({ groups: [SUBMIT_GROUP], message: 'Category must be selected.' })
    @IsEnum(Category, { always: true })
    category?: Category;

    @IsOptional({ groups: [DRAFT_GROUP] })
    @IsDefined({ groups: [SUBMIT_GROUP], message: 'Age is required.' })
    @Type(() => Number)
    @IsInt({ always: true, message: 'Age must be a whole number.' })
    @Min(1, { always: true, message: 'Age must be at least 1.' })
    age?: number;

    @IsOptional({ groups: [DRAFT_GROUP] })
    @IsDefined({ groups: [SUBMIT_GROUP], message: 'WhatsApp is required.' })
    @IsString({ always: true })
    @MaxLength(25, { always: true })
    @Matches(/^\+?[0-9\s\-()]*$/, { groups: [SUBMIT_GROUP], message: 'Invalid WhatsApp number format.' })
    whatsapp?: string;

    @IsOptional({ groups: [DRAFT_GROUP] })
    @IsDefined({ groups: [SUBMIT_GROUP], message: 'Proof of Payment is required.' })
    @IsString({ always: true })
    proofOfPayment?: string;

    @IsOptional({ groups: [DRAFT_GROUP, SUBMIT_GROUP] })
    @IsString({ always: true }) ktmPath?: string;

    @IsOptional({ groups: [DRAFT_GROUP, SUBMIT_GROUP] })
    @IsString({ always: true }) idCardPath?: string;

    @IsOptional({ groups: [DRAFT_GROUP] })
    @IsString({ always: true })
    @Matches(/^[A-Za-z]\d{8}$/, { groups: [SUBMIT_GROUP], message: 'Invalid NRP format (e.g., c14200001).' })
    nrp?: string;

    @IsOptional({ groups: [DRAFT_GROUP] })
    @Type(() => Number)
    @IsInt({ always: true, message: 'Batch must be a whole number.' })
    @Min(2000, { groups: [SUBMIT_GROUP], message: 'Batch year seems too early.' })
    batch?: number;

    @IsOptional({ groups: [DRAFT_GROUP] })
    @IsString({ always: true })
    major?: string;

    @IsOptional({ groups: [DRAFT_GROUP] })
    @IsString({ always: true })
    instance?: string;
}