import type { RequestHandler } from 'express';
import postService from '../../services/client/post.service.js';
import type { AuthRequest } from '../../types/auth-request.type.js';
import type { PostUpdateDTO } from '../../types/post.type.js';
import type { GetPostsQuery } from '../../types/posts-query.type.js';
import { catchAsync } from '../../utils/catch-async.js';

class PostController {
  index: RequestHandler = catchAsync(async (req, res): Promise<void> => {
    const limitParam = req.query.limit as string | undefined;

    const queryParams: GetPostsQuery = {
      limit: limitParam ? limitParam : '10',
    };

    if (req.query.cursor) queryParams.cursor = req.query.cursor as string;
    if (req.query.search) queryParams.search = req.query.search as string;
    if (req.query.categoryId)
      queryParams.categoryId = req.query.categoryId as string;
    if (req.query.tagId) queryParams.tagId = req.query.tagId as string;
    if (req.query.username) queryParams.username = req.query.username as string;
    if (req.query.authorName)
      queryParams.authorName = req.query.authorName as string;

    const result = await postService.getAllWithCursor(queryParams);

    res.status(200).json({
      status: 'success',
      data: result.posts,
      pagination: result.pagination,
    });
  });

  show: RequestHandler = catchAsync(
    async (req: AuthRequest, res): Promise<void> => {
      const { id } = req.params as { id: string };
      const result = await postService.getById(id);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    },
  );

  showAllComments: RequestHandler = catchAsync(
    async (req, res): Promise<void> => {
      const { id } = req.params as { id: string };
      const result = await postService.getAllComments(id);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    },
  );

  create: RequestHandler = catchAsync(
    async (req: AuthRequest, res): Promise<void> => {
      const { title, content, published, categoryId, tagIds } = req.body;

      const currentUserId = req.user?.userId ?? '';

      const importData = {
        title: title,
        content: content,
        published: published,
        authorId: currentUserId,
        categoryId: categoryId,
        tags: tagIds,
      };

      const newPost = await postService.createPost(importData);

      res.status(201).json({
        status: 'success',
        data: newPost,
      });
    },
  );

  update: RequestHandler = catchAsync(
    async (req: AuthRequest, res): Promise<void> => {
      const { id } = req.params as { id: string };
      const { title, content, published, categoryId, tagIds } = req.body;

      const currentUserId = req.user?.userId ?? '';

      const updateData: PostUpdateDTO = {
        title,
        content,
        published,
        categoryId: categoryId || null,
        tags: tagIds || [],
      };

      const updatedPost = await postService.updatePost(
        id,
        currentUserId,
        updateData,
      );

      res.status(200).json({
        status: 'success',
        data: updatedPost,
      });
    },
  );

  delete: RequestHandler = catchAsync(
    async (req: AuthRequest, res): Promise<void> => {
      const { id } = req.params as { id: string };
      const currentUserId = req.user?.userId ?? '';

      await postService.deletePost(id, currentUserId);

      res.status(204).send();
    },
  );
}

export default new PostController();
