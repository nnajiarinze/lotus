import { Router } from 'express';
import authMiddleware from '../controllers/Auth';
import AdminController from '../controllers/Admin';
import MemberController from '../controllers/Member';
import cors from 'cors';
import SubscriptionController from '../controllers/Subscription';

const router = new Router();


//router.options('*',AdminController.options);
router.get('/admin',cors(),authMiddleware, AdminController.index);
router.post('/admin/',cors(),authMiddleware, AdminController.create);
router.post('/admin/signIn',cors(), AdminController.signIn);
router.post('/admin/newsletter/',cors(), AdminController.sendNewsLetter);



router.post('/member/',cors(),authMiddleware,MemberController.create);
router.post('/member/validateUsername',cors(),authMiddleware,MemberController.validateUsername);
router.post('/member/medicals',cors(),authMiddleware,MemberController.createMedicals);
router.post('/member/subscription',cors(),authMiddleware,MemberController.createSubscription);

router.get('/member',cors(),authMiddleware,MemberController.fetchById);
router.get('/member/list',cors(),authMiddleware, MemberController.fetchPaginated);
router.get('/member/stats',cors(),authMiddleware,MemberController.membersStats);
router.get('/member/active', cors(),authMiddleware, MemberController.fetchPagniatedActiveMembers);
router.get('/member/inactive',cors(),authMiddleware,MemberController.fetchPaginatedInactiveMembers);

router.put('/member',cors(),authMiddleware,MemberController.update);
router.put('/member/medicals',cors(),authMiddleware,MemberController.updateMedicals);



router.post('/subscription',cors(),authMiddleware,SubscriptionController.create);
router.put('/subscription',cors(),authMiddleware,SubscriptionController.update);


export default router;
