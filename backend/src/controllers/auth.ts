import { Request, Response, NextFunction } from 'express';
import * as UserService from 'services/user';
import passport from 'passport';
import winston from 'winston';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.isAuthenticated()) {
      res.status(403).json({});
      return;
    }
    const result = await UserService.create(req.body);
    if (result.success) {
      res.json({});
    } else {
      res.status(400).json({reason: result.reason});
    }
  } catch (err) {
    next(err);
  }
}

export const login = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.status(403).json({reason: 'AUTHENTICATED'});
    } else {
      next();
    }
  },
  passport.authenticate('local', {failWithError: true}),
  (req: Request, res: Response) => {
    res.json({
      username: (req.currentUser as any)?.username,
      name: (req.currentUser as any)?.name
    });
  },
  (err: any, _: Request, res: Response, __: NextFunction) => {
    /**
     * @see AuthService.authenticate reason values
     */
    if (err === 'WRONG_CREDENTIALS') {
      res.status(401).json({reason: err});
    } else {
      winston.warn(`Uncaught error during authentication: ${err}`);
      res.status(500).json({});
    }
  }
];

export function logout(req: Request, res: Response) {
  req.logout();
  res.clearCookie('connect.sid'); 
  res.json({});
}