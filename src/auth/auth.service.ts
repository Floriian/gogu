import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private config: ConfigService) {}

  hashes = parseInt(this.config.get('SALT_ROUNDS'));

  /**
   *
   * Register with email, and password
   * /auth/signup
   */

  async signup(dto: AuthDto) {
    const salt = await bcrypt.hashSync(dto.password, this.hashes);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash: salt,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('This email is already registered!');
        }
        throw error;
      }
    }
  }

  async signin(dto: AuthDto) {
    return dto;
  }
}
