import type { RequestHandler } from 'express';
import commentService from '../../services/client/comment.service.js';
import type { AuthRequest } from '../../types/auth-request.type.js';
import type { CommentUpdateDTO } from '../../types/comment.type.js';
import type { GetCommentsQuery } from '../../types/comments-query.js';
import { catchAsync } from '../../utils/catch-async.js';

class CommentController {
  index: RequestHandler = catchAsync(async (req, res): Promise<void> => {
    const limitParam = req.query.limit as string | undefined;

    const queryParams: GetCommentsQuery = {
      limit: limitParam ? limitParam : '20',
    };

    if (req.query.cursor) queryParams.cursor = req.query.cursor as string;
    if (req.query.search) queryParams.search = req.query.search as string;
    if (req.query.postId) queryParams.postId = req.query.postId as string;
    if (req.query.username) queryParams.username = req.query.username as string;
    if (req.query.authorName)
      queryParams.authorName = req.query.authorName as string;

    const result = await commentService.getAllWithCursor(queryParams);

    res.status(200).json({
      status: 'success',
      data: result.comments,
      pagination: result.pagination,
    });
  });

  create: RequestHandler = catchAsync(
    async (req: AuthRequest, res): Promise<void> => {
      const { content, postId } = req.body;
      const currentUserId = req.user?.userId ?? '';

      const importData = {
        content: content,
        authorId: currentUserId,
        postId: postId,
      };

      const newPost = await commentService.createComment(importData);

      res.status(201).json({
        status: 'success',
        data: newPost,
      });
    },
  );

  update: RequestHandler = catchAsync(
    async (req: AuthRequest, res): Promise<void> => {
      const { id } = req.params as { id: string };
      const { content } = req.body;

      const currentUserId = req.user?.userId ?? '';

      const updateData: CommentUpdateDTO = { content };

      const updatedPost = await commentService.updateComment(
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

      await commentService.deleteComment(id, currentUserId);

      res.status(204).send();
    },
  );
}

export default new CommentController();
