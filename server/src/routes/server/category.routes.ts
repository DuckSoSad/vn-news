import { Router } from 'express';
import * as categoryController from '../../controllers/server/category.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router: Router = Router();

router.get('/', categoryController.index);
router.post('/', authMiddleware, categoryController.create);
router.put('/:id', authMiddleware, categoryController.update);
router.delete('/:id', authMiddleware, categoryController.remove);

export default router;
