export interface Category {
  id: string;
  name: string;
  postsCount: number;
}

export interface GetCategoriesQuery {
  limit?: number;
}
