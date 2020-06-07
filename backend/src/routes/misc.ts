import * as MiscController from 'controllers/misc';
import express from 'express';
import {query} from 'express-validator';
import { rejectValFail } from 'middlewares/error';

const router = express.Router();

router.get('/categories/list', MiscController.listCategories);
router.get('/restaurants/list', [
  query('category').isString()
], rejectValFail, MiscController.listRestaurants);

export default router;
