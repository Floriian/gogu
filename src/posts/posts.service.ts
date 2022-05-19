import { ForbiddenException, Injectable } from '@nestjs/common';
import { Post, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPostDto, getOnePostDto } from './dto';

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
      });
      return post;
    } catch (error) {
      console.log(error);
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

  async deletePost(id: string) {
    const _id = parseInt(id);
    try {
      const post = await this.prisma.post.delete({
        where: {
          id: _id,
        },
      });
    } catch (error) {
      //P2025
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new ForbiddenException("This post doesn't exists!");
        }
        throw error;
      }
    }
  }
}
