import { Router } from 'express';
import userController from '../../controllers/server/user.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';

const router: Router = Router();

router.get('/', authMiddleware, userController.index);

export default router;
