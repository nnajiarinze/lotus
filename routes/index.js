import { Router } from 'express';
import authMiddleware from '../controllers/Auth';
import AdminController from '../controllers/Admin';
import MemberController from '../controllers/Member';
import cors from 'cors';

const router = new Router();


router.options('*',AdminController.options);
router.get('/admin',authMiddleware, AdminController.index);
router.post('/admin/',authMiddleware, AdminController.create);
router.post('/admin/signIn', AdminController.signIn);



router.post('/member/',authMiddleware,MemberController.create);
router.get('/member',authMiddleware,MemberController.fetchById);
router.put('/member',authMiddleware,MemberController.update);

export default router;
