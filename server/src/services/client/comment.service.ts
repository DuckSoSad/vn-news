import { HandleError } from '../../errors/handle-error.js';
import type {
  CommentCreateInput,
  CommentUpdateInput,
  CommentWhereInput,
} from '../../generated/prisma/models.js';
import commentRepository from '../../repository/client/comment.repository.js';
import type { CommentCreateDTO } from '../../types/comment.type.js';
import type { GetCommentsQuery } from '../../types/comments-query.js';

class CommentService {
  async getAllWithCursor(queryParams: GetCommentsQuery) {
    const limit = Number(queryParams.limit);
    const { cursor, search, postId, username, authorName } = queryParams;

    const where: CommentWhereInput = {
      ...(postId && {
        postId: postId,
      }),

      ...(search && {
        OR: [
          { content: { contains: search } },
          {
            author: {
              name: { contains: search },
            },
          },
        ],
      }),

      ...((username || authorName) && {
        author: {
          ...(username && { username }),
          ...(authorName && {
            name: { contains: authorName },
          }),
        },
      }),
    };

    const comments = await commentRepository.findManyWithCursor({
      where,
      take: limit + 1,
      cursorId: cursor || undefined,
    });

    const hasNextPage = comments.length > limit;
    const dataResult = hasNextPage ? comments.slice(0, limit) : comments;
    const nextCursor = dataResult.at(-1)?.id || null;

    return {
      comments: dataResult,
      pagination: {
        limit,
        nextCursor: hasNextPage ? nextCursor : null,
        hasNextPage,
      },
    };
  }

  async createComment(dto: CommentCreateDTO) {
    const prismaData: CommentCreateInput = {
      content: dto.content,
      author: {
        connect: { id: dto.authorId },
      },
      post: {
        connect: { id: dto.postId },
      },
    };

    return await commentRepository.create(prismaData);
  }

  async updateComment(
    id: string,
    currentAuthorId: string,
    data: CommentUpdateInput,
  ) {
    const authorId = await commentRepository.findAuthor(id);
    console.log(authorId);
    if (!authorId) {
      throw new HandleError(404, 'The comment does not exist!');
    } else if (authorId !== currentAuthorId) {
      throw new HandleError(
        401,
        'You do not have the authority to edit this comment!',
      );
    }

    return await commentRepository.update(id, data);
  }

  async deleteComment(id: string, currentAuthorId: string): Promise<void> {
    const authorId = await commentRepository.findAuthor(id);
    if (!authorId) {
      throw new Error('The post does not exist!');
    } else if (authorId !== currentAuthorId) {
      throw new HandleError(
        401,
        'You do not have the authority to delete this comment!',
      );
    }

    return await commentRepository.delete(id);
  }
}

export default new CommentService();
