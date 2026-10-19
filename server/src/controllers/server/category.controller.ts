import type { RequestHandler } from 'express';
import * as categoryService from '../../services/server/category.service.js';
import { toCategoryDTO } from '../../types/category.mapper.js';
import { catchAsync } from '../../utils/catch-async.js';

export const index: RequestHandler = catchAsync(
  async (_req, res): Promise<void> => {
    const data = await categoryService.getAll();

    res.status(200).json({
      status: 'success',
      data: data.map(toCategoryDTO),
    });
  },
);

export const create: RequestHandler = catchAsync(
  async (req, res): Promise<void> => {
    const data = req.body;
    const newCategory = await categoryService.createCategory(data);

    res.status(201).json({
      status: 'success',
      data: newCategory,
    });
  },
);

export const update: RequestHandler = catchAsync(
  async (req, res): Promise<void> => {
    const { id } = req.params as { id: string };
    const data = req.body;

    const updatedCategory = await categoryService.updateCategory(id, data);

    res.status(200).json({
      status: 'success',
      data: updatedCategory,
    });
  },
);

export const remove: RequestHandler = catchAsync(
  async (req, res): Promise<void> => {
    const { id } = req.params as { id: string };
    await categoryService.deleteCategory(id);

    res.status(204).send();
  },
);
