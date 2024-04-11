import { Router } from 'express';
const router = Router();
const userRoutes = require('../controller/Usercontroller');

router.use('/', userRoutes);
export = router;
