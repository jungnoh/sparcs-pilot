import {ObjectId} from 'bson';
import moment from 'moment';
import FoodCategoryModel, {FoodCategoryDoc} from 'models/FoodCategory';
import GroupModel, {GroupDoc} from 'models/Group';
import RestaurantModel, {RestaurantDoc} from 'models/Restaurant';
import { MeetTimes } from '@common/models/Group';
import { ServiceResult } from 'utils/types';
import UserModel from 'models/User';
import { randomString } from 'utils/crypto';

// 새벽 6시가 기준!
function today(): Date {
  return moment().subtract('hours', 6).set({hour: 0, minute: 0, second: 0, millisecond: 0}).toDate();
}

export async function list(categoryString?: string, time?: MeetTimes): ServiceResult<void, GroupDoc[]> {
  let query;
  if (categoryString) {
    const category = await FoodCategoryModel.findOne({key: categoryString});
    if (!category) {
      return {success: true, result: []};
    }
    query = GroupModel.find({category: category._id, meetDate: {$gte: today()}});
  } else {
    query = GroupModel.find({meetDate: {$gte: today()}});
  }
  if (time) {
    query = query.find({meetTime: time});
  }
  query = query.populate('category').populate('restaurant').sort('-createdAt');
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

export async function addRestaurant(name: string, categories: ObjectId[], user?: ObjectId): Promise<RestaurantDoc> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const payload: {[key: string]: any} = {categories, name};
  if (user) {
    payload.createdBy = user;
  }
  const newObj = await RestaurantModel.create(payload);
  return newObj;
}

export async function viewGroup(id: ObjectId): ServiceResult<void, GroupDoc | null> {
  const result = await GroupModel.findById(id)
    .populate('members', 'username phone dorm email name')
    .populate('category')
    .populate('restaurant');
  return {
    success: true,
    result
  };
}

export async function joinGroup(username: string, group: ObjectId):
ServiceResult<'USER_NEXIST'|'GROUP_NEXIST'|'GROUP_FULL'|'USER_IN_GROUP'> {
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
  const meLength = groupObj.members.filter(x => (x.user as ObjectId).equals(userObj._id)).length;
  if (meLength > 0) {
    return {reason: 'USER_IN_GROUP', success: false};
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

export async function listUserGroups(username: string, isOwner: boolean):
ServiceResult<'USER_NEXIST', GroupDoc[]> {
  const userObj = await UserModel.findOne({username});
  if (!userObj) {
    return {reason: 'USER_NEXIST', success: false};
  }
  if (isOwner) {
    return {
      result: await GroupModel.find({owner: userObj._id}),
      success: true
    };
  } else {
    return {
      result: await GroupModel.find({members: {$elemMatch: {user: userObj._id}}}),
      success: true
    };
  }
}
