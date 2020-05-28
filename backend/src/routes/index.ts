import express from 'express';

const router = express.Router();

router.all('/', async (_, res) => {
  res.send('Hi').end();
});

export default router;
