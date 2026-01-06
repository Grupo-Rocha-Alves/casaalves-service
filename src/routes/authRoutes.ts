import { Router } from 'express';
import { register, login, me, changePassword, updateUser, listUsers } from '../controller/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { logMiddleware } from '../middleware/logMiddleware';
import { logAction } from '../helpers/logHelper';

const router = Router();

router.post('/register', authMiddleware(3), logMiddleware(logAction.create('usuário')), register);
router.post('/login', logMiddleware(logAction.login()), login);
router.get('/me', authMiddleware(), me);
router.post('/changePassword', authMiddleware(), logMiddleware(logAction.changePassword()), changePassword);
router.get('/getAllUsers', authMiddleware(3), listUsers);
router.patch('/updateUser/:id', authMiddleware(3), logMiddleware(logAction.update('usuário')), updateUser);

export default router;
