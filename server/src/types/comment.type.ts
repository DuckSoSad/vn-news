export interface CommentCreateDTO {
  content: string;
  authorId: string;
  postId: string;
}

export interface CommentUpdateDTO {
  content: string;
}
