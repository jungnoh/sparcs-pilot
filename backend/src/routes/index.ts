import express from 'express';

import AuthRouter from './auth';

const router = express.Router();

router.use('/auth', AuthRouter);

router.all('/', async (_, res) => {
  res.send('Hi').end();
});

export default router;
