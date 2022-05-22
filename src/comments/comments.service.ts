import {
  ForbiddenException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { GetUser } from 'src/auth/decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCommentDto } from './dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}
  /**
   *
   * @param id
   * @returns Comments for a post
   */
  async getAllComments(id: string) {
    const _id = parseInt(id);
    try {
      const comment = await this.prisma.comment.findMany({
        where: {
          postId: _id,
        },
      });
      if (comment.length > 0) {
        return comment;
      } else {
        return new ForbiddenException('This post is not exists');
      }
    } catch (err) {
      if (err instanceof PrismaClientValidationError) {
        throw new ForbiddenException('Invalid comment id!');
      }
      throw err;
    }
  }
  async getCommentsByUsername(name: string) {
    try {
      const comment = await this.prisma.comment.findMany({
        where: {
          user: {
            username: name,
          },
        },
      });
      if (comment.length > 0) {
        return comment;
      } else {
        return new NotFoundException('Invalid username');
      }
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new ForbiddenException('Invalid username!');
      }
      throw error;
    }
  }

  async createComment(dto: createCommentDto, user: User) {
    const id = parseInt(dto.id);
    try {
      const comment = await this.prisma.comment.create({
        data: {
          body: dto.body,
          title: dto.title ? null : dto.title,
          postId: id,
          userId: user.id,
        },
      });
      if (comment) {
        return comment;
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteComment(id: string, user: User) {
    const _id = parseInt(id);
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          username: user.username,
        },
      });

      const comment = await this.prisma.comment.delete({
        where: {
          id: _id,
        },
      });

      if (comment.userId == findUser.id) {
        return 'Sikeres törlés!';
      } else {
        return new ForbiddenException();
      }
    } catch (error) {
      console.log(error);
    }
  }
}
