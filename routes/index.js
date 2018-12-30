import { Router } from 'express';
import authMiddleware from '../controllers/Auth';
import AdminController from '../controllers/Admin';
import MemberController from '../controllers/Member';
import cors from 'cors';

const router = new Router();


router.options('*',AdminController.options);
router.get('/admin',authMiddleware, AdminController.index);
router.post('/admin/',authMiddleware, AdminController.create);
router.post('/admin/signIn',cors(), AdminController.signIn);



router.post('/member/',authMiddleware,MemberController.create);
router.post('/member/validateUsername',authMiddleware,MemberController.validateUsername);
router.post('/member/medicals',authMiddleware,MemberController.createMedicals);
router.get('/member',authMiddleware,MemberController.fetchById);
router.get('/member/list',authMiddleware, MemberController.fetchPaginated);
router.put('/member',authMiddleware,MemberController.update);
router.put('/member/medicals',authMiddleware,MemberController.updateMedicals);


export default router;
