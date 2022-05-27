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
@Controller('')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto, @GetUser() user: User) {
    return this.adminService.create(createAdminDto, user);
  }

  @Get()
  findAll(@GetUser() user: User) {
    return this.adminService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser() user: User) {
    return this.adminService.findOne(+id, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: UpdateAdminDto,
    @GetUser() user: User,
  ) {
    return this.adminService.update(+id, updateAdminDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.adminService.remove(+id, user);
  }
}
