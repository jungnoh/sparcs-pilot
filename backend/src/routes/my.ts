import express from 'express';
import {query} from 'express-validator';
import * as MyController from 'controllers/my';
import { checkAuthenticated } from 'middlewares/auth';
import { rejectValFail } from 'middlewares/error';

const router = express.Router();
router.use(checkAuthenticated);

router.get('/groups', [
  query('owner').exists().isBoolean()
], rejectValFail, MyController.myGroups);

router.get('/profile', MyController.getProfile);
router.put('/profile', MyController.updateProfile);

export default router;
 