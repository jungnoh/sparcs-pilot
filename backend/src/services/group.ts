import {ObjectId} from 'bson';
import FoodCategoryModel, {FoodCategoryDoc} from 'models/FoodCategory';
import GroupModel, {GroupDoc} from 'models/Group';
import RestaurantModel, {RestaurantDoc} from 'models/Restaurant';
import { MeetTimes } from '@common/models/Group';
import { ServiceResult } from 'utils/types';
import UserModel from 'models/User';
import { randomString } from 'utils/crypto';

export async function list(categoryString?: string, time?: MeetTimes): ServiceResult<void, GroupDoc[]> {
  let query;
  if (categoryString) {
    const category = await FoodCategoryModel.findOne({key: categoryString});
    if (!category) {
      return {success: true, result: []};
    }
    query = GroupModel.find({category: category._id});
  } else {
    query = GroupModel.find();
  }
  if (time) {
    query = query.find({meetTime: time});
  }
  query = query.sort('-createdAt');
  return {
    success: true,
    result: await query
  };
}

export async function listCategories(): Promise<FoodCategoryDoc[]> {
  return await FoodCategoryModel.find();
}

export async function listRestaurants(category?: string): Promise<RestaurantDoc[]> {
  let query;
  if (category) {
    const categoryObj = await FoodCategoryModel.findOne({key: category});
    if (!categoryObj) {
      return [];
    }
    query = RestaurantModel.find({category: categoryObj._id});
  } else {
    query = RestaurantModel.find();
  }
  return await query;
}

export async function viewGroup(id: ObjectId): ServiceResult<void, GroupDoc | null> {
  return {
    success: true,
    result: await GroupModel.findById(id)
  };
}

export async function joinGroup(username: string, group: ObjectId):
ServiceResult<'USER_NEXIST'|'GROUP_NEXIST'|'GROUP_FULL'> {
  const userObj = await UserModel.findOne({username});
  if (!userObj) {
    return {reason: 'USER_NEXIST', success: false};
  }
  const groupObj = await GroupModel.findById(group);
  if (!groupObj) {
    return {reason: 'GROUP_NEXIST', success: false};
  }
  if (groupObj.locked) {
    return {reason: 'GROUP_FULL', success: false};
  }
  groupObj.members.push({
    nickname: userObj.name + randomString(2),
    user: userObj._id
  });
  if (groupObj.members.length >= groupObj.peopleNeeded) {
    groupObj.locked = true;
  }
  await groupObj.save();
  return {success: true};
}

export async function leaveGroup(username: string, group: ObjectId): 
ServiceResult<'USER_NEXIST'|'GROUP_NEXIST'|'GROUP_LOCKED'|'USER_NOT_IN_GROUP'> {
  const userObj = await UserModel.findOne({username});
  if (!userObj) {
    return {reason: 'USER_NEXIST', success: false};
  }
  const groupObj = await GroupModel.findById(group);
  if (!groupObj) {
    return {reason: 'GROUP_NEXIST', success: false};
  }
  if (groupObj.locked) {
    return {reason: 'GROUP_LOCKED', success: false};
  }
  const filteredMembers = groupObj.members.filter(x => !(x.user as ObjectId).equals(userObj._id));
  if (filteredMembers.length === groupObj.members.length) {
    return {reason: 'USER_NOT_IN_GROUP', success: false};
  }
  groupObj.members = filteredMembers;
  groupObj.save();
  return {success: true};
}
