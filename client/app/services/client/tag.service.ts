import { api } from '~/lib/api';
import { ENDPOINTS } from '~/lib/endpoints';
import type { Tag } from '~/types/tag.type';

export const TagService = {
  getTags: async (): Promise<Tag[]> => {
    const res = await api.get<Tag[]>(ENDPOINTS.tags);
    return res.data;
  },
};
