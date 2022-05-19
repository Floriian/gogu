import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { createPostDto, getOnePostDto } from './dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @Get('all')
  all() {
    return this.postService.getAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.getOne(id);
  }
  @UseGuards(JwtGuard)
  @Post('create')
  createPost(@Body() dto: createPostDto, @GetUser() user: User) {
    return this.postService.create(dto, user);
  }
  @UseGuards(JwtGuard)
  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
