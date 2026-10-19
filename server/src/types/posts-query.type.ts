export interface GetPostsQuery {
  limit?: string;
  cursor?: string;
  search?: string;
  categoryId?: string;
  tagId?: string;
  username?: string;
  authorName?: string;
}
