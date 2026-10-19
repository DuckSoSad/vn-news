import { HandleError } from '../../errors/handle-error.js';
import type { Post } from '../../generated/prisma/client.js';
import type {
  PostCreateInput,
  PostUpdateInput,
  PostWhereInput,
} from '../../generated/prisma/models.js';
import postRepository from '../../repository/client/post.repository.js';
import type { PostCreateDTO, PostUpdateDTO } from '../../types/post.type.js';
import type { GetPostsQuery } from '../../types/posts-query.type.js';
import { generateSlug } from '../../utils/slug.js';

class PostService {
  async getAllWithCursor(queryParams: GetPostsQuery) {
    const limit = Number(queryParams.limit);
    const { cursor, search, categoryId, tagId, username, authorName } =
      queryParams;

    const where: PostWhereInput = username
      ? { author: { username: username } }
      : { published: true };

    // insensitive: search gan dung, khong phan biet hoa thuong.
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tagId) {
      where.tags = {
        some: {
          id: tagId,
        },
      };
    }

    if (authorName) {
      where.author = {
        name: { contains: authorName },
      };
    }

    const posts = await postRepository.findManyWithCursor({
      where,
      take: limit + 1,
      cursorId: cursor || undefined,
    });

    const hasNextPage = posts.length > limit;
    const dataResult = hasNextPage ? posts.slice(0, limit) : posts;
    const nextCursor = dataResult.at(-1)?.id || null;

    return {
      posts: dataResult,
      pagination: {
        limit,
        nextCursor: hasNextPage ? nextCursor : null,
        hasNextPage,
      },
    };
  }

  async getById(id: string) {
    const result = await postRepository.findById(id);
    if (!result) {
      throw new HandleError(404, 'Post not found.');
    }
    return result;
  }

  async getAllComments(id: string) {
    return await postRepository.findAllComments(id);
  }

  async createPost(dto: PostCreateDTO) {
    const prismaData: PostCreateInput = {
      title: dto.title,
      slug: dto.title ? generateSlug(dto.title) : '',
      content: dto.content,
      published: dto.published,
      author: {
        connect: { id: dto.authorId },
      },
    };

    if (dto.categoryId) {
      prismaData.category = {
        connect: { id: dto.categoryId },
      };
    }

    if (dto.tags && dto.tags.length > 0) {
      prismaData.tags = {
        connect: dto.tags.map((tagId) => ({ id: tagId })),
      };
    }

    return await postRepository.create(prismaData);
  }

  async updatePost(
    id: string,
    currentAuthorId: string,
    dto: PostUpdateDTO,
  ): Promise<Post> {
    const prismaData: PostUpdateInput = {
      title: dto.title,
      slug: dto.title ? generateSlug(dto.title) : '',
      content: dto.content,
      published: dto.published,

      category: dto.categoryId
        ? { connect: { id: dto.categoryId } }
        : { disconnect: true },

      tags: { set: (dto.tags || []).map((tagId) => ({ id: tagId })) },
    };

    const authorId = await postRepository.findAuthor(id);
    if (!authorId) {
      throw new Error('The post does not exist!');
    } else if (authorId !== currentAuthorId) {
      throw new HandleError(
        401,
        'You do not have the authority to edit this post!',
      );
    }

    return await postRepository.update(id, prismaData);
  }

  async deletePost(id: string, currentAuthorId: string): Promise<void> {
    const authorId = await postRepository.findAuthor(id);
    if (!authorId) {
      throw new Error('The post does not exist!');
    } else if (authorId !== currentAuthorId) {
      throw new HandleError(
        401,
        'You do not have the authority to delete this post!',
      );
    }

    return await postRepository.delete(id);
  }
}

export default new PostService();
