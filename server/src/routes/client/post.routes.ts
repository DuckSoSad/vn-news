import { Router } from 'express';
import postController from '../../controllers/client/post.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router: Router = Router();

router.get('/', postController.index);
router.get('/:id', postController.show);
router.get('/:id/comments', postController.showAllComments);
router.post('/', authMiddleware, postController.create);
router.put('/:id', authMiddleware, postController.update);
router.delete('/:id', authMiddleware, postController.delete);

export default router;
