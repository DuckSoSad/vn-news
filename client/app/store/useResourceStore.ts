import { create } from 'zustand';
import type { Category } from '~/types/category.type';
import type { Tag } from '~/types/tag.type';

interface ResourceState {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
  resetCategories: () => void;

  tags: Tag[];
  setTags: (tags: Tag[]) => void;
  resetTags: () => void;
}

export const useResourceStore = create<ResourceState>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
  resetCategories: () =>
    set({
      categories: [],
    }),

  tags: [],
  setTags: (tags) => set({ tags }),
  resetTags: () =>
    set({
      tags: [],
    }),
}));
