import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './admin/admin.module';
import { RouterModule } from '@nestjs/core';
import { AdminCommentsModule } from './admin/comments/comments.module';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PostsModule,
    CommentsModule,
    //AdminModule
    AdminModule,
    AdminCommentsModule,
    RouterModule.register([
      {
        path: 'admin',
        module: AdminModule,
        children: [
          {
            path: 'comments',
            module: AdminCommentsModule,
          },
        ],
      },
    ]),
    //End of AdminModule
  ],
})
export class AppModule {}
