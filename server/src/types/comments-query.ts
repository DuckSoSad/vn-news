export interface GetCommentsQuery {
  limit?: string;
  cursor?: string;
  search?: string;
  postId?: string;
  username?: string;
  authorName?: string;
}
