/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {Request, Response, NextFunction} from 'express';
import * as UserService from 'services/user';
import * as GroupService from 'services/group';

/**
 * @description Controller for `GET /my/groups`
 */
export async function myGroups(req: Request, res: Response, next: NextFunction) {
  try {
    const isOwner = (req.query.owner as string) ?? undefined;
    const user = req.currentUser!.username;
    const result = await GroupService.listUserGroups(user, isOwner === undefined ? undefined : Boolean(isOwner));
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `GET /my/profile`
 */
export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    res.json(req.currentUser);
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `PUT /my/profile`
 */
export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await UserService.update(req.currentUser!.username, {
      name: req.body.name,
      phone: req.body.phone,
      dorm: req.body.dorm
    }, req.body.password ?? undefined);
    res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
}