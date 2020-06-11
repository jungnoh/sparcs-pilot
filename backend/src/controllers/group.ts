/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ObjectId } from 'bson';
import {Request, Response, NextFunction} from 'express';
import * as GroupService from 'services/group';
import { MeetTimes } from '@common/models/Group';
import { UserDoc } from 'models/User';

/**
 * @description Controller for `POST /group/join`
 */
export async function joinGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!.username;
    const group = req.body.group;
    const result = await GroupService.joinGroup(user, group);
    if (result.reason === 'USER_IN_GROUP') {
      return res.status(403).json({});
    }
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `POST /group/create`
 */
export async function createGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await GroupService.createGroup({
      owner: req.user!._id,
      category: req.body.category,
      restaurant: req.body.restaurant ? new ObjectId(req.body.restaurant) : undefined,
      peopleNeeded: req.body.peopleNeeded,
      talkLink: req.body.talkLink,
      title: req.body.title,
      meetTime: req.body.meetTime
    });
    if (!result.success) {
      return res.status(400).json({});
    }
    return res.json({id: result.result!._id});
  } catch(err) {
    next(err);
  }
}

/**
 * @description Controller for `POST /group/leave`
 */
export async function leaveGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user!.username;
    const group = req.body.group;
    const result = await GroupService.leaveGroup(user, group);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `GET /groups/list` and `GET /group/list/:category`
 */
export async function listGroups(req: Request, res: Response, next: NextFunction) {
  try {
    const category = (req.params.category as string) ?? undefined;
    const time = (req.query.time as MeetTimes) ?? undefined;
    const result = ((await GroupService.list(category, time)).result)?.map(x => ({
      title: x.title,
      category: x.category,
      restaurant: x.restaurant,
      createdAt: x.createdAt,
      meetDate: x.meetDate,
      meetTime: x.meetTime,
      memberCount: x.members.length+1,
      peopleNeeded: x.peopleNeeded,
      locked: x.locked,
      id: x._id
    }));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * @description Controller for `GET /groups/:id`
 */
export async function viewGroup(req: Request, res: Response, next: NextFunction) {
  try {
    const result = (await GroupService.viewGroup(new ObjectId(req.params.id))).result;
    if (!result) {
      return res.status(404).json({});
    }
    const inMembers = result.members.filter(x => (x.user as UserDoc)._id.equals(req.user!._id)).length > 0;
    if (!(result.owner as UserDoc)._id.equals(req.user!._id) && !inMembers) {
      return res.status(404).json({});
    }
    return res.json(result);
  } catch (err) {
    next(err);
  }
}
