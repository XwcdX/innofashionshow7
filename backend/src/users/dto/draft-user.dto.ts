import {
    IsString,
    IsOptional,
    IsEnum,
    IsInt,
    Min,
    Matches,
    MaxLength,
    IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Category {
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
}

export class DraftUserDto {
    @IsOptional()
    @IsEnum(Category)
    category?: Category;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Age must be a whole number.' })
    @Min(1, { message: 'Age must be at least 1.' })
    age?: number;

    @IsOptional()
    @IsString()
    @MaxLength(25)
    @Matches(/^\+?[0-9\s\-()]*$/, { message: 'Invalid WhatsApp number format.' })
    whatsapp?: string;

    // --- File Paths (received from frontend) ---
    @IsOptional()
    @IsString()
    proofPath?: string;

    @IsOptional()
    @IsString()
    ktmPath?: string;

    @IsOptional()
    @IsString()
    idCardPath?: string;

    // --- Internal User Specific ---
    @IsOptional()
    @IsString()
    @Matches(/^[A-Za-z]\d{8}$/, { message: 'Invalid NRP format (e.g., c14200001).' })
    nrp?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'Batch must be a whole number.' })
    @Min(2000, { message: 'Batch year seems too early.' })
    batch?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Major cannot be empty if provided.' })
    major?: string;

    // --- External User Specific ---
    @IsOptional()
    @IsString()
    @IsNotEmpty({ message: 'Instance/School cannot be empty if provided.' })
    instance?: string;
}