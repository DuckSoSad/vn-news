import { create } from 'zustand';
import type { Post } from '~/types/post.type';

interface PostState {
  posts: Post[];
  cursorId?: string;
  hasMore: boolean;
  setPosts: (posts: Post[]) => void;
  addPosts: (newPosts: Post[]) => void;
  prependPost: (post: Post) => void;
  setCursorId: (cursorId?: string) => void;
  setHasMore: (hasMore: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  cursorId: undefined,
  hasMore: true,

  setPosts: (posts) => set({ posts }),

  addPosts: (newPosts) =>
    set((state) => ({ posts: [...state.posts, ...newPosts] })),

  prependPost: (post) => set((state) => ({ posts: [post, ...state.posts] })),

  setCursorId: (cursorId) => set({ cursorId }),
  setHasMore: (hasMore) => set({ hasMore }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      posts: [],
      cursorId: undefined,
      hasMore: true,
      isLoading: false,
    }),
}));
