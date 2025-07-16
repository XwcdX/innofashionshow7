// backend/src/auth/auth.controller.ts
import { Body, Controller, Post, HttpCode, HttpStatus, Request, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  // Biarkan constructor dan method signIn yang sudah ada
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    // ... method signIn yang sudah ada, tidak perlu diubah
  }

  // --- TAMBAHKAN ENDPOINT BARU DI BAWAH INI ---
  @Public() // Endpoint ini publik karena dipanggil oleh NextAuth di server-side
  @Post('google-login')
  googleLogin(@Body() userDto: { email: string; name: string }) {
    return this.authService.loginWithGoogle(userDto);
  }


  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}