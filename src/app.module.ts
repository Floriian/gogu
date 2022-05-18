import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { PostService } from './post/post.service';
@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ isGlobal: true }), AuthModule, PostsModule],
  providers: [PostService],
})
export class AppModule {}
