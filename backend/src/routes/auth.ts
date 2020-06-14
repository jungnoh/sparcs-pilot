import express from 'express';
import { userSignupVal } from 'utils/validators';
import { rejectValFail } from 'middlewares/error';
import * as AuthController from 'controllers/auth';
import { body } from 'express-validator';

const router = express.Router();

router.post('/signup', [
  ...userSignupVal
], rejectValFail, AuthController.signup);

router.post('/login', [
  body('username').exists(),
  body('password').exists()
], rejectValFail, AuthController.login);

router.post('/logout', AuthController.logout);

export default router;