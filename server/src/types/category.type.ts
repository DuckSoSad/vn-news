import type { CategoryGetPayload } from '../generated/prisma/models.js';

export type CategoryWithCount = CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    _count: {
      select: { posts: true };
    };
  };
}>;
