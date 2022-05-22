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
import { CommentsService } from './comments.service';
import { createCommentDto } from './dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @Get(':id')
  getAllCommentsById(@Param('id') id: string) {
    return this.commentService.getAllComments(id);
  }

  @Get('users/:name')
  getCommentsByUsername(@Param('name') name: string) {
    return this.commentService.getCommentsByUsername(name);
  }

  @UseGuards(JwtGuard)
  @Post('create')
  createComment(@Body() dto: createCommentDto, @GetUser() user: User) {
    return this.commentService.createComment(dto, user);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteComment(@Param('id') id: string, @GetUser() user: User) {
    return this.commentService.deleteComment(id, user);
  }
}
