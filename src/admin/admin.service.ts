import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}
  create(createAdminDto: CreateAdminDto, user: User) {
    return 'This action adds a new admin';
  }

  findAll(user: User) {
    if (user.admin == true) {
      return 'ok';
    } else {
      return false;
    }
  }

  findOne(id: number, user: User) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto, user: User) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number, user: User) {
    return `This action removes a #${id} admin`;
  }
}
