import { Router } from 'express';
import commentController from '../../controllers/client/comment.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createCommentSchema,
  updateCommentSchema,
} from '../../validations/client/comment.validation.js';

const router: Router = Router();

router.get('/', commentController.index);
router.post(
  '/',
  authMiddleware,
  validate(createCommentSchema),
  commentController.create,
);
router.put(
  '/:id',
  authMiddleware,
  validate(updateCommentSchema),
  commentController.update,
);
router.delete('/:id', authMiddleware, commentController.delete);

export default router;
