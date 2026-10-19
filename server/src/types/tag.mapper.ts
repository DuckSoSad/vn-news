import type { TagDTO } from './tag.dto.js';
import type { TagWithCount } from './tag.type.js';

export function toTagDTO(data: TagWithCount): TagDTO {
  return {
    id: data.id,
    name: data.name,
    postsCount: data._count.posts,
  };
}
