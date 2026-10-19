import { Router } from 'express';
import authController from '../../controllers/client/auth.controller.js';

const router: Router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.post('/check-account', authController.checkAccount);

export default router;
