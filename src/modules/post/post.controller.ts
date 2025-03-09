import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { Post as PostModel } from '@prisma/client';
import {
  ApiBody,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

import { PostService } from './post.service';
import { CreatePostDto, PostResponseDTO } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/auth.jwt.guard';

@ApiTags('posts')
@Controller('/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get('/')
  async getAllPosts(): Promise<PostModel[]> {
    return this.postService.findAll({});
  }

  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<PostModel> {
    const post = await this.postService.findOne({ id: Number(id) });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  @Get('feed')
  async getPublishedPosts(): Promise<PostModel[]> {
    return this.postService.findAll({
      where: { published: true },
    });
  }

  @Get('filtered-posts')
  async getFilteredPosts(
    @Query('searchString') searchString: string,
  ): Promise<PostModel[]> {
    return this.postService.findAll({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            content: { contains: searchString },
          },
        ],
      },
    });
  }

  @Post('post')
  @ApiBody({ type: CreatePostDto })
  @ApiExtraModels(PostResponseDTO)
  @ApiResponse({
    status: 201,
    schema: {
      $ref: getSchemaPath(PostResponseDTO),
    },
  })
  @UseGuards(JwtAuthGuard)
  async createDraft(@Body() postData: CreatePostDto): Promise<PostModel> {
    const { title, content, authorEmail } = postData;
    return this.postService.create({
      title,
      content,
      User: {
        connect: { email: authorEmail },
      },
    });
  }

  @Put('publish/:id')
  async publishPost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.update({
      where: { id: Number(id) },
      data: { published: true },
    });
  }

  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<PostModel> {
    return this.postService.delete({ id: Number(id) });
  }
}
