import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';

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
      if (comment) return comment;
      if (comment === []) return new ForbiddenException();
    } catch (err) {
      if (err instanceof PrismaClientValidationError) {
        throw new ForbiddenException('Invalid post id!');
      }
    }
  }
}
