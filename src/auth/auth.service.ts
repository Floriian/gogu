import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import * as md5 from 'md5';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  hashes = parseInt(this.config.get('SALT_ROUNDS'));

  /**
   *
   * Register with email, and password
   * /auth/signup
   */

  async signup(dto: RegisterDto) {
    const salt = await md5(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          hash: salt,
        },
      });
      return this.signToken(user.id, user.email, user.username);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException(
            'This email/username is already registered!',
          );
        }
        throw error;
      }
    }
  }
  /**
   *
   * Login user with email
   * /auth/sigin
   */
  async signin(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('User not found!');
    const hashedDto = await md5(dto.password);

    if (hashedDto == user.hash) {
      return this.signToken(user.id, user.email, user.username);
    } else {
      throw new ForbiddenException('Password incorrect');
    }

    //fck bcrypt compare, i always suck wit hit
    // const matchymatchy = await bcrypt.compareSync(hashedDto, user.hash);
    // console.log(hashedDto, user.hash);
    // if (!matchymatchy) throw new ForbiddenException('Password incorrect');
    // return this.signToken(user.id, user.email, user.username);
  }

  async signToken(
    userId: number,
    email: string,
    username: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
      username,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
