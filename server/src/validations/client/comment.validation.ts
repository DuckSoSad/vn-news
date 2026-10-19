import { z } from 'zod';

export const createCommentSchema = z.object({
  body: z.object({
    content: z
      .string('Content is required.')
      .min(1, 'Content cannot be empty.')
      .max(500, 'Content cannot exceed 500 characters.'),
    postId: z.cuid2('Invalid format of post ID.'),
  }),
});

export const updateCommentSchema = z.object({
  params: z.object({
    id: z.cuid2('Invalid format of comment ID on URL.'),
  }),
  body: z.object({
    content: z
      .string('Content is required.')
      .min(1, 'Content cannot be empty.')
      .max(500, 'Content cannot exceed 500 characters.'),
  }),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
