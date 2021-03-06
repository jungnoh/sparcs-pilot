import {ObjectId} from 'bson';
import mongo from 'mongoose';
import { FoodCategory } from './FoodCategory';
import { Restaurant } from './Restaurant';
import { User } from './User';

export type MeetTimes = '0-2'|'2-4'|'11-13'|'17-19'|'19-21'|'21-24';

export interface Group {
  title: string;
  category: FoodCategory;
  restaurant?: Restaurant;
  
  createdAt: Date;
  meetDate: Date;
  meetTime: MeetTimes;
  
  owner: ObjectId | User;
  members: {
    nickname: string;
    user: ObjectId | User;
  }[];
  peopleNeeded: number;
  locked: boolean;
  talkLink: string;
}


const schema = new mongo.Schema<Group>({
  title: {required: true, type: String},
  category: {ref: 'FoodCategory', required: true, type: ObjectId},
  restaurant: {ref: 'Restaurant', required: false, type: ObjectId},
  meetDate: {required: true, type: Date},
  meetTime: {
    enum: ['0-2', '2-4', '11-13', '17-19', '19-21', '21-24'],
    required: true,
    type: String
  },
  owner: {ref: 'User', required: true, type: ObjectId},
  members: {
    default: [],
    type: [{nickname: String, user: {ref: 'User', type: ObjectId}}]
  },
  peopleNeeded: {default: 4, required: true, type: Number},
  locked: {default: false, required: true, type: Boolean},
  talkLink: {required: false, type: String}
}, {
  timestamps: true
});
schema.index('category -meetDate');

export type GroupDoc = Group & mongo.TimestampedDocument;
const GroupModel = mongo.model<GroupDoc>('Group', schema);
export default GroupModel;
