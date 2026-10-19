import { api } from '~/lib/api';
import { ENDPOINTS } from '~/lib/endpoints';
import type { Category } from '~/types/category.type';

export const CategoryService = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>(ENDPOINTS.categories);
    return res.data;
  },
};
