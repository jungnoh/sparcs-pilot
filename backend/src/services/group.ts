import {ObjectId} from 'bson';
import moment from 'moment';
import FoodCategoryModel, {FoodCategoryDoc} from 'models/FoodCategory';
import GroupModel, {GroupDoc} from 'models/Group';
import RestaurantModel, {RestaurantDoc} from 'models/Restaurant';
import { MeetTimes } from '@common/models/Group';
import { ServiceResult } from 'utils/types';
import UserModel from 'models/User';
import { randomString } from 'utils/crypto';

const MEET_TIME_OFFSETS: {[key: string]: number} = {
  '11-13': 5,
  '17-19': 11,
  '19-21': 13,
  '21-24': 15,
  '0-2': 18,
  '2-4': 20
};

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
    .populate('members.user', 'username dorm email name')
    .populate('owner', 'username dorm email name')
    .populate('category')
    .populate('restaurant');
  return {
    success: true,
    result
  };
}

export async function createGroup(group: {
  owner: ObjectId;
  category: string;
  restaurant?: ObjectId;
  peopleNeeded: number;
  talkLink: string;
  title: string;
  meetTime: string;
}): ServiceResult<'CATEGORY_NEXIST' | 'RESTAURANT_NEXIST' | 'OWNER_NEXIST', GroupDoc> {
  const category = await FoodCategoryModel.findOne({key: group.category});
  const restaurant = group.restaurant && (await RestaurantModel.findOne({key: group.restaurant}));
  const owner = await UserModel.findById(group.owner);
  if (!category) {
    return {success: false, reason: 'CATEGORY_NEXIST'};
  }
  if (group.restaurant && !restaurant) {
    return {success: false, reason: 'RESTAURANT_NEXIST'};
  }
  if (!owner) {
    return {success: false, reason: 'OWNER_NEXIST'};
  }
  const meetDate = moment().subtract('hours', 6).set({hour: MEET_TIME_OFFSETS[group.meetTime], minute: 0, second: 0, millisecond: 0}).toDate();
  const ret = await GroupModel.create({
    title: group.title,
    category,
    restaurant,
    meetDate,
    meetTime: group.meetTime as MeetTimes,
    owner,
    members: [],
    peopleNeeded: group.peopleNeeded,
    locked: false,
    talkLink: group.talkLink
  });
  return {result: ret, success: true};
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
  if (meLength > 0 || userObj._id.equals(groupObj.owner)) {
    return {reason: 'USER_IN_GROUP', success: false};
  }
  groupObj.members.push({
    nickname: userObj.name + randomString(2),
    user: userObj._id
  });
  if ((groupObj.members.length+1) >= groupObj.peopleNeeded) {
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

export async function listUserGroups(username: string, isOwner?: boolean):
ServiceResult<'USER_NEXIST', GroupDoc[]> {
  const userObj = await UserModel.findOne({username});
  if (!userObj) {
    return {reason: 'USER_NEXIST', success: false};
  }
  let query;
  if (isOwner === undefined) {
    query = GroupModel.find({
      $or: [
        {owner: userObj._id},
        {members: {$elemMatch: {user: userObj._id}}}
      ]
    });
  }
  if (isOwner) {
    query = GroupModel.find({owner: userObj._id});
  } else {
    query = GroupModel.find({members: {$elemMatch: {user: userObj._id}}});
  }
  query = query
    .populate('owner', 'username dorm name email')
    .populate('members.user', 'username dorm name email');
  return {
    success: true,
    result: await query
  };
}
