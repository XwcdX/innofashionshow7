import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Category } from '@prisma/client';

export class LoginDto {
    @IsEnum(Category)
    @IsNotEmpty()
    category: Category;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}