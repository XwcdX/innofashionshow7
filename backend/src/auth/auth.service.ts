import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { UserType, User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async login(dto: LoginDto): Promise<{ token: string; user: User }> {
        const { email, name } = dto;

        const [localPart, domain] = email.split('@');
        const isInternalEmail =
            !!localPart?.match(/^[A-Za-z]\d{8}$/) &&
            domain === 'john.petra.ac.id';

        const calculatedType: UserType = isInternalEmail
            ? UserType.INTERNAL
            : UserType.EXTERNAL;

        const user = await this.prisma.user.upsert({
            where: { email: email },
            update: {
                name: name,
                type: calculatedType,
            },
            create: {
                email: email,
                name: name,
                type: calculatedType,
            },
        });

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.type,
        };

        const token = this.jwtService.sign(payload);
        return { token, user };
    }

    async loginWithGoogle(userDto: { email: string; name: string }) {
    const { email, name } = userDto;
    let user = await this.usersService.findOne(email);

    // Jika user tidak ada di database, buat user baru
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
      user = await this.usersService.create({
        email,
        name,
        password: hashedPassword,
      });
    }

    // Buat "tiket masuk" (JWT) untuk user
    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}