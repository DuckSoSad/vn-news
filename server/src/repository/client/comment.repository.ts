import prisma from '../../config/prisma.js';
import type {
  CommentCreateInput,
  CommentFindManyArgs,
  CommentUpdateInput,
  CommentWhereInput,
} from '../../generated/prisma/models.js';

class CommentRepository {
  async findManyWithCursor({
    where,
    take,
    cursorId,
  }: {
    where: CommentWhereInput;
    take: number;
    cursorId: string | undefined;
  }) {
    const args: CommentFindManyArgs = {
      where,
      take,
      skip: 0,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        content: true,
        author: {
          select: { id: true, name: true, username: true },
        },
        createdAt: true,
        updatedAt: true,
      },
    };

    if (cursorId) {
      args.cursor = { id: cursorId };
      args.skip = 1;
    }

    return prisma.comment.findMany(args);
  }

  async findAuthor(id: string): Promise<string | null> {
    const comment = await prisma.comment.findUnique({
      where: { id },
      select: { authorId: true },
    });

    return comment?.authorId || null;
  }

  async create(data: CommentCreateInput) {
    return await prisma.comment.create({
      data,
      select: {
        content: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: CommentUpdateInput) {
    return await prisma.comment.update({
      where: { id },
      data,
      select: {
        content: true,
        createdAt: true,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.comment.delete({ where: { id } });
  }
}

export default new CommentRepository();
