import {
  ForbiddenException,
  NotFoundException,
  Injectable,
  HttpException,
  HttpStatus,
  NotAcceptableException,
} from '@nestjs/common';
import { Comment, Post, User } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { GetUser } from 'src/auth/decorator';
import { OkException } from 'src/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCommentDto, updateCommentDto } from './dto';

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
        return new ForbiddenException('This comment is not exists');
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
  //TODO delete comment response
  async deleteComment(id: string, user: User) {
    const _id = parseInt(id);
    if (Number.isNaN(_id)) return new NotAcceptableException();
    try {
      const deleteComment = await this.prisma.comment.deleteMany({
        where: {
          AND: {
            id: {
              equals: _id,
            },
            userId: {
              equals: user.id,
            },
          },
        },
      });
      if (deleteComment.count > 0) {
        return new OkException('Successfully deleted comment');
      } else {
        return new ForbiddenException("Couldn't delete this comment");
      }
    } catch (error) {
      console.log(error);
    }
  }
  async updateComment(id: string, dto: updateCommentDto, user: User) {
    const _id = parseInt(id);
    if (Number.isNaN(_id)) return new NotAcceptableException();
    try {
      const update = await this.prisma.comment.updateMany({
        where: {
          AND: [
            {
              id: {
                equals: _id,
              },
              userId: {
                equals: user.id,
              },
            },
          ],
        },
        data: {
          body: dto.body,
          title: dto.title ? dto.title : null,
        },
      });
      if (update.count > 0) {
        return new OkException('Successfully updated comment!');
      } else if (update.count <= 0) {
        return new ForbiddenException("Couldn't update this comment!");
      }
    } catch (error) {
      //P2025 error handling
      console.log(error);
    }
  }
}
