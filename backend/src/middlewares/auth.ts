import { NextFunction, Request, Response } from 'express';

/**
 * @description 사용자가 로그인되어 있는지 확인합니다.
 */
export function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    res.status(401).json({reason: 'UNAUTHENTICATED'});
  } else {
    next();
  }
}