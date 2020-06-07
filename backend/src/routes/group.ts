import express from 'express';
import { param, query, body } from 'express-validator';
import * as GroupController from 'controllers/group';
import { rejectValFail } from 'middlewares/error';
import { checkAuthenticated } from 'middlewares/auth';

const meetTimes = ['0-2','2-4','11-13','17-19','19-21','21-24'];

const router = express.Router();

router.post('/join', checkAuthenticated, [
  body('group').exists().isMongoId(),
], rejectValFail, GroupController.joinGroup);

router.post('/leave', checkAuthenticated, [
  body('group').exists().isMongoId()
], rejectValFail, GroupController.leaveGroup);

router.get('/list', [
  query('time').isIn(meetTimes)
], rejectValFail, GroupController.listGroups);
router.get('/list/:category', [
  query('time').isIn(meetTimes),
  param('category').notEmpty()
], rejectValFail, GroupController.listGroups); 

router.get('/:id', [
  param('id').isMongoId()
], rejectValFail, GroupController.viewGroup);

export default router;
