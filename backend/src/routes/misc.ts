import * as MiscController from 'controllers/misc';
import express from 'express';
import {query, body} from 'express-validator';
import { checkAuthenticated } from 'middlewares/auth';
import { rejectValFail } from 'middlewares/error';

const router = express.Router();

router.get('/categories/list', MiscController.listCategories);

router.get('/restaurants/list', [
  query('category').isString()
], rejectValFail, MiscController.listRestaurants);

// Require login to prevent spamming
router.post('/restaurants/add', checkAuthenticated, [
  body('name').exists().notEmpty(),
  body('categories').exists().isArray()
], rejectValFail, MiscController.addRestaurant);

export default router;
