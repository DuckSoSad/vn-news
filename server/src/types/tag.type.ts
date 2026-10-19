import type { TagGetPayload } from '../generated/prisma/models.js';

export type TagWithCount = TagGetPayload<{
  select: {
    id: true;
    name: true;
    _count: {
      select: { posts: true };
    };
  };
}>;
