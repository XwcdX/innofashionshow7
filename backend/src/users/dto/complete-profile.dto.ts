import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    IsUrl,
    ValidateIf,
  } from 'class-validator';
  import { UserType } from '@prisma/client';
  
  export class CompleteProfileDto {
    @IsEnum(UserType)
    @IsNotEmpty()
    type: UserType;

    @IsInt()
    age: number;
  
    @IsString()
    @IsNotEmpty()
    whatsapp: string;
  
    @IsUrl()
    @IsNotEmpty()
    proofOfPayment: string;

    @ValidateIf((o) => o.type === UserType.INTERNAL)
    @IsString()
    @IsNotEmpty()
    nrp?: string;
  
    @ValidateIf((o) => o.type === UserType.INTERNAL)
    @IsInt()
    batch?: number;
  
    @ValidateIf((o) => o.type === UserType.INTERNAL)
    @IsString()
    @IsNotEmpty()
    major?: string;
  
    @ValidateIf((o) => o.type === UserType.INTERNAL)
    @IsUrl()
    @IsNotEmpty()
    ktm?: string;

    @ValidateIf((o) => o.type === UserType.EXTERNAL)
    @IsString()
    @IsNotEmpty()
    instance?: string;
  
    @ValidateIf((o) => o.type === UserType.EXTERNAL)
    @IsUrl()
    @IsNotEmpty()
    idCard?: string;
  }