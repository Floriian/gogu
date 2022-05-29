import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { JwtGuard } from 'src/auth/guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { GetUser } from 'src/auth/decorator';
import { AuthService } from 'src/auth/auth.service';

@UseGuards(JwtGuard)
@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('userstats')
  getUsersRegistrationStatics(@GetUser() user: User) {
    return this.adminService.getUsersRegistrationStatics(user);
  }
}
