import { HandleError } from '../../errors/handle-error.js';
import type { Tag } from '../../generated/prisma/client.js';
import type { TagCreateInput } from '../../generated/prisma/models.js';

import * as tagRepository from '../../repository/server/tag.repository.js';
import type { TagWithCount } from '../../types/tag.type.js';

export async function getAll(): Promise<TagWithCount[]> {
  return await tagRepository.findAll();
}

export async function createTag(data: TagCreateInput): Promise<Tag> {
  const existTag = await tagRepository.existByName(data.name);
  if (existTag) {
    throw new HandleError(400, 'This tag already exists.');
  }

  return await tagRepository.create(data);
}

export async function updateTag(
  id: string,
  data: TagCreateInput,
): Promise<Tag> {
  const existTag = await tagRepository.existByName(data.name);
  if (existTag && existTag.id !== id) {
    throw new HandleError(400, 'This tag already exists.');
  }

  return await tagRepository.update(id, data);
}

export async function deleteTag(id: string): Promise<void> {
  return await tagRepository.remove(id);
}
