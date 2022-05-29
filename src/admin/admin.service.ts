import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

interface RegResult {
  regCount: number;
  createdAt: string;
}
//interface RegResults extends Array<RegResult> {}
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getUsersRegistrationStatics(user: User) {
    if (user.admin) {
      const users = await this.prisma.user.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          createdAt: true,
        },
      });

      const res: RegResult = {
        regCount: users.length,
        createdAt: users,
      };
    } else {
      return new UnauthorizedException();
    }
  }
}
