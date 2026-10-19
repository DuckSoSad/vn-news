import { api } from '~/lib/api';
import { ENDPOINTS } from '~/lib/endpoints';
import type { Comment } from '~/types/comment.type';
import type {
  CreatePostInput,
  GetPostsQuery,
  GetPostsResponse,
  Post,
} from '~/types/post.type';

export const PostService = {
  getPosts: async (params: GetPostsQuery): Promise<GetPostsResponse> => {
    const res = await api.get<GetPostsResponse>(ENDPOINTS.posts, { params });
    return res as unknown as GetPostsResponse;
  },

  getPostById: async (id: string): Promise<Post> => {
    const res = await api.get<Post>(ENDPOINTS.postById(id));
    return res.data;
  },

  getCommentsByPostId: async (id: string): Promise<Comment[]> => {
    const res = await api.get<{ comments: Comment[] }>(
      ENDPOINTS.commentsByPostId(id),
    );
    return res.data.comments;
  },

  createPost: async (data: CreatePostInput): Promise<Post> => {
    const res = await api.post<Post>(ENDPOINTS.posts, data);
    return res.data;
  },

  updatePost: async (id: string, data: CreatePostInput): Promise<Post> => {
    const res = await api.put<Post>(ENDPOINTS.postById(id), data);
    return res.data;
  },

  deletePost: async (id: string) => {
    const res = await api.delete(ENDPOINTS.postById(id));
    return res.data;
  },
};
