export interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
}

export interface GetCommentsQuery {
  limit?: string;
  cursor?: string;
  search?: string;
  postId?: string;
  username?: string;
  authorName?: string;
}

export interface CommentsPagination {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface GetCommentsResponse {
  data: Comment[];
  pagination: CommentsPagination;
}
