import type { RequestHandler } from 'express';
import * as tagService from '../../services/server/tag.service.js';
import { toTagDTO } from '../../types/tag.mapper.js';
import { catchAsync } from '../../utils/catch-async.js';

export const index: RequestHandler = catchAsync(
  async (_req, res): Promise<void> => {
    const data = await tagService.getAll();

    res.status(200).json({
      status: 'success',
      data: data.map(toTagDTO),
    });
  },
);

export const create: RequestHandler = catchAsync(
  async (req, res): Promise<void> => {
    const data = req.body;
    const newTag = await tagService.createTag(data);

    res.status(201).json({
      status: 'success',
      data: newTag,
    });
  },
);

export const update: RequestHandler = catchAsync(
  async (req, res): Promise<void> => {
    const { id } = req.params as { id: string };
    const data = req.body;

    const updatedTag = await tagService.updateTag(id, data);

    res.status(200).json({
      status: 'success',
      data: updatedTag,
    });
  },
);

export const remove: RequestHandler = catchAsync(
  async (req, res): Promise<void> => {
    const { id } = req.params as { id: string };
    await tagService.deleteTag(id);

    res.status(204).send();
  },
);
