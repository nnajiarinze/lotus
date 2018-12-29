import { Router } from 'express';
import authMiddleware from '../controllers/Auth';
import AdminController from '../controllers/Admin';
import MemberController from '../controllers/Member';

const router = new Router();

if (req.method === 'OPTIONS') {
    console.log('!OPTIONS');
    var headers = {};
    // IE8 does not allow domains to be specified, just the *
    // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    res.writeHead(200, headers);
    res.end();
}

router.get('/admin',authMiddleware, AdminController.index);
router.post('/admin/',authMiddleware, AdminController.create);
router.post('/admin/signIn', AdminController.signIn);


router.post('/member/',authMiddleware,MemberController.create);
router.get('/member',authMiddleware,MemberController.fetchById);
router.put('/member',authMiddleware,MemberController.update);

export default router;
