import FoodCategory from './FoodCategory';
import Restaurant from './Restaurant';
import { User } from './User';
import { ObjectId } from 'bson';

export default interface Group {
  title: string;
  category: FoodCategory;
  restaurant?: Restaurant;
  
  createdAt: Date;
  meetDate: Date;
  meetTime: '0-2'|'2-4'|'11-13'|'17-19'|'19-21'|'21-24';
  
  owner: ObjectId | User;
  members: {
    nickname: string;
    user: ObjectId | User;
  }[];
  peopleNeeded: number;
  locked: boolean;
  talkLink: string;
}
