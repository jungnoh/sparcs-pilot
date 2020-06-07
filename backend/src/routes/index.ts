import express from 'express';

import AuthRouter from './auth';
import GroupRouter from './group';
import MiscRouter from './misc';
import MyRouter from './my';

const router = express.Router();

router.use('/auth', AuthRouter);
router.use('/group', GroupRouter);
router.use('/my', MyRouter);
router.use(MiscRouter);

export default router;
