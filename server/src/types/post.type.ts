export interface PostCreateDTO {
  title: string;
  content: string;
  published: boolean;
  authorId: string;
  categoryId?: string;
  tags?: string[];
}

export interface PostUpdateDTO {
  title: string;
  content: string;
  published: boolean;
  categoryId?: string;
  tags: string[];
}
