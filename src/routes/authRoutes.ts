import { Router } from 'express';
import { register, login, me, changePassword, updateUser, listUsers } from '../controller/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { logMiddleware } from '../middleware/logMiddleware';
import { acaoLog } from '../helpers/logHelper';

const router = Router();

router.post('/register', authMiddleware(3), logMiddleware(acaoLog.criar('usuário')), register);

router.post('/login', logMiddleware(acaoLog.login()), login);

router.get('/me', authMiddleware(), me);

router.post('/changePassword', authMiddleware(), logMiddleware(acaoLog.alterarSenha()), changePassword);

router.get('/getAllUsers', authMiddleware(3), listUsers);

router.patch('/updateUser/:id', authMiddleware(3), logMiddleware(acaoLog.atualizar('usuário')), updateUser);

export default router;
