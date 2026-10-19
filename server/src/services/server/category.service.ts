import { HandleError } from '../../errors/handle-error.js';
import type { Category } from '../../generated/prisma/client.js';
import type { CategoryCreateInput } from '../../generated/prisma/models.js';

import * as categoryRepository from '../../repository/server/category.repository.js';
import type { CategoryWithCount } from '../../types/category.type.js';

export async function getAll(): Promise<CategoryWithCount[]> {
  return await categoryRepository.findAll();
}

export async function createCategory(
  data: CategoryCreateInput,
): Promise<Category> {
  const existCategory = await categoryRepository.existByName(data.name);
  if (existCategory) {
    throw new HandleError(400, 'This category already exists.');
  }

  return await categoryRepository.create(data);
}

export async function updateCategory(
  id: string,
  data: CategoryCreateInput,
): Promise<Category> {
  const existCategory = await categoryRepository.existByName(data.name);
  if (existCategory && existCategory.id !== id) {
    throw new HandleError(400, 'This category already exists.');
  }

  return await categoryRepository.update(id, data);
}

export async function deleteCategory(id: string): Promise<void> {
  return await categoryRepository.remove(id);
}
