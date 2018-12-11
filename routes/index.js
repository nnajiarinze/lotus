import { Router } from 'express';

import AdminController from '../controllers/Admin';

const router = new Router();

router.get('/admin', AdminController.index);

export default router;
