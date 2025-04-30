import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AdminAuthService } from './admin-auth.service';
import { AdminLoginDto } from './dto/admin-login.dto';

@Controller('admin/auth')
export class AdminAuthController {
    constructor(private readonly auth: AdminAuthService) { }
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body() dto: AdminLoginDto) {
        return this.auth.login(dto);
    }
}
