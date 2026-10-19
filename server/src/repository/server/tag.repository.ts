import prisma from '../../config/prisma.js';
import type { Tag } from '../../generated/prisma/client.js';
import type {
  TagCreateInput,
  TagFindManyArgs,
  TagUpdateInput,
} from '../../generated/prisma/models.js';
import type { TagWithCount } from '../../types/tag.type.js';

export async function findAll(): Promise<TagWithCount[]> {
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
  } satisfies TagFindManyArgs;
  return await prisma.tag.findMany(args);
}

export async function existByName(
  name: string,
): Promise<{ id: string } | null> {
  const tag = await prisma.tag.findUnique({
    where: { name },
    select: { id: true },
  });
  return tag;
}

export async function create(data: TagCreateInput): Promise<Tag> {
  return await prisma.tag.create({ data });
}

export async function update(id: string, data: TagUpdateInput): Promise<Tag> {
  return await prisma.tag.update({ where: { id }, data });
}

export async function remove(id: string): Promise<void> {
  await prisma.tag.delete({ where: { id } });
}
