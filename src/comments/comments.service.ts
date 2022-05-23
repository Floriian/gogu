import {
  ForbiddenException,
  NotFoundException,
  Injectable,
  HttpException,
  HttpStatus,
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
    try {
      const findUser = await this.prisma.user.findUnique({
        where: {
          username: user.username,
        },
        include: {
          comments: true,
        },
      });

      findUser.comments.map((comment: Comment) => {
        if (comment.id === _id) {
          return this.deleteCommentFromDb(_id);
        } else {
          return new ForbiddenException(
            'This user is not allowed to delete comment!',
          );
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCommentFromDb(id: number) {
    try {
      const del = await this.prisma.comment.delete({
        where: {
          id,
        },
      });
      return 'Successfully deleted';
    } catch (error) {
      console.log(error);
    }
  }

  async updateComment(id: string, dto: updateCommentDto, user: User) {
    const _id = parseInt(id);
    try {
      const update = await this.prisma.comment.findMany({
        where: {
          id: _id,
          userId: user.id,
        },
      });
      if (update.length > 0) {
        return new OkException('Successfully updated!');
      } else {
        return new ForbiddenException('Could not update the comment!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  // async updateCommentDb(id: number, dto: updateCommentDto) {
  //   try {
  //     const update = await this.prisma.comment.update({
  //       where: {
  //         id: id,
  //       },
  //       data: {
  //         body: dto.body,
  //         title: dto.title ? dto.title : undefined,
  //       },
  //     });
  //     if (update) return 'Successfully updated comment!';
  //     if (!update) return new ForbiddenException('Server error!');
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
}
