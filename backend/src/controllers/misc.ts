/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {Request, Response, NextFunction} from 'express';
import * as GroupService from 'services/group';

/**
 * @description Controller for `GET categories/list`
 */
export async function listCategories(_: Request, res: Response, next: NextFunction) {
  try {
    res.json(await GroupService.listCategories());
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `GET /restaurants/list`
 */
export async function listRestaurants(req: Request, res: Response, next: NextFunction) {
  try {
    const key = req.query.category as string;
    res.json(await GroupService.listRestaurants(key ?? undefined));
  } catch (err) {
    next(err);
  }
}
