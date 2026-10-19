import type { CategoryDTO } from './category.dto.js';
import type { CategoryWithCount } from './category.type.js';

export function toCategoryDTO(data: CategoryWithCount): CategoryDTO {
  return {
    id: data.id,
    name: data.name,
    postsCount: data._count.posts,
  };
}
