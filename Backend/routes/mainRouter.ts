import { Router } from 'express';
const router = Router();

const userRoutes = require('../Usercontroller/Usercontroller');

router.use('/user', userRoutes);

export = router;
