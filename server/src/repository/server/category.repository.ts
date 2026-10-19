import prisma from '../../config/prisma.js';
import type { Category } from '../../generated/prisma/client.js';
import type {
  CategoryCreateInput,
  CategoryFindManyArgs,
  CategoryUpdateInput,
} from '../../generated/prisma/models.js';
import type { CategoryWithCount } from '../../types/category.type.js';

export async function findAll(): Promise<CategoryWithCount[]> {
  const args = {
    orderBy: [{ posts: { _count: 'desc' } }],
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          posts: {
            where: { published: true },
          },
        },
      },
    },
  } satisfies CategoryFindManyArgs;

  return await prisma.category.findMany(args);
}

export async function existByName(
  name: string,
): Promise<{ id: string } | null> {
  const category = await prisma.category.findUnique({
    where: { name },
    select: { id: true },
  });
  return category;
}

export async function create(data: CategoryCreateInput): Promise<Category> {
  return await prisma.category.create({ data });
}

export async function update(
  id: string,
  data: CategoryUpdateInput,
): Promise<Category> {
  return await prisma.category.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await prisma.category.delete({ where: { id } });
}
