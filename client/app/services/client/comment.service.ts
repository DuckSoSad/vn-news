import { api } from '~/lib/api';
import { ENDPOINTS } from '~/lib/endpoints';
import type {
  CreateCommentInput,
  GetCommentsQuery,
  GetCommentsResponse,
} from '~/types/comment.type';

export const CommentService = {
  getComments: async (
    params: GetCommentsQuery,
  ): Promise<GetCommentsResponse> => {
    const res = await api.get<GetCommentsResponse>(ENDPOINTS.comments, {
      params,
    });
    return res as unknown as GetCommentsResponse;
  },

  createComment: async (data: CreateCommentInput) => {
    const res = await api.post(ENDPOINTS.comments, data);
    return res.data;
  },

  updateComment: async (
    commentId: string,
    data: Omit<CreateCommentInput, 'postId'>,
  ) => {
    const res = await api.put(`${ENDPOINTS.commentById(commentId)}`, data);
    return res.data;
  },

  deleteComment: async (commentId: string) => {
    const res = await api.delete(`${ENDPOINTS.commentById(commentId)}`);
    return res.data;
  },
};
