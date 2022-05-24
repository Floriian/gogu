import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Post, User, Comment } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { userInfo } from 'os';
import { use } from 'passport';
import { OkException } from 'src/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPostDto, updatePostDto } from './dto';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const posts = await this.prisma.post.findMany({});
    return posts;
  }

  async getOne(id: string) {
    const _id = parseInt(id);
    try {
      const post = await this.prisma.post.findUnique({
        where: {
          id: _id,
        },
        include: {
          comment: true,
          User: {
            select: {
              username: true,
            },
          },
        },
      });
      if (post) return post;
      if (!post) return new NotFoundException('This post is not exists');
    } catch (error) {
      if (error instanceof PrismaClientValidationError) {
        throw new ForbiddenException('Invalid post id');
      }
      throw error;
    }
  }

  async create(dto: createPostDto, user: User) {
    try {
      const post = await this.prisma.post.create({
        data: {
          body: dto.body,
          title: dto.title,
          userId: user.id,
        },
      });
      return post;
    } catch (error) {
      console.log(error);
    }
  }

  async deletePost(id: string, user: User) {
    const _id = parseInt(id);
    try {
      const post = await this.prisma.post.deleteMany({
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
      });
      if (post.count > 0) {
        return new OkException('Successfully deleted post!');
      } else if (post.count <= 0) {
        return new ForbiddenException("Couldn't deleted this post!");
      }
    } catch (error) {
      //P2025 in console, if not handling this error.
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException("This post doesn't exists!");
        }
        throw error;
      }
    }
  }

  async updatePost(id: string, dto: updatePostDto, user: User) {
    const _id = parseInt(id);
    try {
      const post = await this.prisma.post.updateMany({
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
          title: dto.title,
        },
      });
      if (post.count > 0) {
        return new OkException('Successfully updated post!');
      } else if (post.count <= 0) {
        return new ForbiddenException("Couldn't update this post!");
      }
    } catch (error) {
      //P2025 in console, if not handling this error.
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException("This post doesn't exists!");
        }
        throw error;
      }
    }
  }
}
