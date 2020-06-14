/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {ObjectId} from 'bson';
import {Request, Response, NextFunction} from 'express';
import * as GroupService from 'services/group';
import { isValidObjectId } from 'mongoose';

/**
 * @description Controller for `GET /categories/list`
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

/**
 * @description Controller for `POST /restaurants/add`
 */
export async function addRestaurant(req: Request, res: Response, next: NextFunction) {
  try {
    const categoryIsValid = req.body.categories.filter((x: string) => isValidObjectId(x)) === 0;
    if (!categoryIsValid) {
      return res.status(400).json();
    }
    const created = await GroupService.addRestaurant(
      req.body.name,
      req.body.categories.filter((x: string) => new ObjectId(x)),
      (req.currentUser as any)!._id
    );
    return res.status(200).json({created});
  } catch (err) {
    next(err);
  }
}