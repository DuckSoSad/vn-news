import prisma from '../../config/prisma.js';

import type { Post } from '../../generated/prisma/client.js';
import type {
  PostCreateInput,
  PostFindManyArgs,
  PostUpdateInput,
  PostWhereInput,
} from '../../generated/prisma/models.js';

class PostRepository {
  async findAll() {
    return await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        author: { select: { name: true } },
        category: { select: { name: true } },
        tags: { select: { name: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAuthor(id: string): Promise<string | null> {
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    return post?.authorId || null;
  }

  async findById(id: string) {
    return await prisma.post.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        author: {
          select: { id: true, name: true, username: true },
        },
        category: {
          select: { name: true },
        },
        tags: { select: { name: true } },
        _count: { select: { comments: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findAllComments(id: string) {
    return await prisma.post.findUnique({
      where: { id },
      select: {
        authorId: true,
        comments: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            author: {
              select: { id: true, name: true, username: true },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }

  async findManyWithCursor({
    where,
    take,
    cursorId,
  }: {
    where: PostWhereInput;
    take: number;
    cursorId: string | undefined;
  }) {
    const args: PostFindManyArgs = {
      where,
      take,
      skip: 0,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        author: {
          select: { name: true, username: true },
        },
        category: {
          select: { name: true },
        },
        tags: { select: { name: true } },
        _count: { select: { comments: true } },
        createdAt: true,
        updatedAt: true,
      },
    };

    if (cursorId) {
      args.cursor = { id: cursorId };
      args.skip = 1;
    }

    return prisma.post.findMany(args);
  }

  async create(data: PostCreateInput) {
    return await prisma.post.create({
      data,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        author: {
          select: { id: true, name: true, username: true },
        },
        category: {
          select: { name: true },
        },
        tags: { select: { name: true } },
        _count: { select: { comments: true } },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, data: PostUpdateInput): Promise<Post> {
    return await prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.post.delete({ where: { id } });
  }
}

export default new PostRepository();
