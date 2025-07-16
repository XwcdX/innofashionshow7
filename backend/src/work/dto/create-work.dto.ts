// file: backend/src/work/dto/create-work.dto.ts

import { IsString, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateWorkDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  imageUrl: string;

  @IsUrl()
  @IsOptional()
  link?: string;
}