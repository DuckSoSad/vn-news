import { create } from 'zustand';
import type { Comment } from '~/types/comment.type';

interface CommentState {
  comments: Comment[];
  cursorId?: string;
  hasMore: boolean;
  setComments: (comments: Comment[]) => void;
  addComments: (newComments: Comment[]) => void;
  prependComment: (comment: Comment) => void;
  setCursorId: (cursorId?: string) => void;
  setHasMore: (hasMore: boolean) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useCommentStore = create<CommentState>((set) => ({
  comments: [],
  cursorId: undefined,
  hasMore: true,

  setComments: (comments) => set({ comments }),

  addComments: (newComments) =>
    set((state) => ({ comments: [...state.comments, ...newComments] })),

  prependComment: (comment) =>
    set((state) => ({ comments: [comment, ...state.comments] })),

  setCursorId: (cursorId) => set({ cursorId }),
  setHasMore: (hasMore) => set({ hasMore }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  reset: () =>
    set({
      comments: [],
      cursorId: undefined,
      hasMore: true,
      isLoading: false,
    }),
}));
