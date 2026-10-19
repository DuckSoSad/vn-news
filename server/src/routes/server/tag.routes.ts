import { Router } from 'express';
import * as tagController from '../../controllers/server/tag.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router: Router = Router();

router.get('/', tagController.index);
router.post('/', authMiddleware, tagController.create);
router.put('/:id', authMiddleware, tagController.update);
router.delete('/:id', authMiddleware, tagController.remove);

export default router;
