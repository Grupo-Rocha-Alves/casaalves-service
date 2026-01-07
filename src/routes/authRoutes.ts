import { Router } from 'express';
import { register, login, me, changePassword, updateUser, listUsers, deleteUser } from '../controller/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { logMiddleware } from '../middleware/logMiddleware';
import { logAction } from '../helpers/logHelper';

const router = Router();

router.post('/register', authMiddleware(3), logMiddleware(logAction.create('usuário')), register);
router.post('/login', logMiddleware(logAction.login()), login);
router.get('/me', authMiddleware(1), me);
router.post('/changePassword', authMiddleware(1), logMiddleware(logAction.changePassword()), changePassword);
router.get('/getAllUsers', authMiddleware(3), listUsers);
router.patch('/updateUser/:id', authMiddleware(3), logMiddleware(logAction.update('usuário')), updateUser);
router.delete('/deleteUser/:id', authMiddleware(3), logMiddleware(logAction.delete('usuário')), deleteUser);

export default router;
