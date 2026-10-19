import type { Tag } from './tag.type';

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
  category: {
    name: string;
  };
  tags: Tag[];
  _count: {
    comments: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  content: string;
  published: boolean;
  categoryId?: string;
  tagIds?: string[];
}

export interface GetPostsQuery {
  limit?: string;
  cursor?: string;
  search?: string;
  categoryId?: string;
  tagId?: string;
  username?: string;
  authorName?: string;
}

export interface PostsPagination {
  limit: number;
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface GetPostsResponse {
  data: Post[];
  pagination: PostsPagination;
}
