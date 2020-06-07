import { ObjectId } from 'bson';
import FoodCategory from './FoodCategory';
import { User } from './User';

export default interface Restaurant {
  categories: FoodCategory[];
  createdBy?: User | ObjectId;
  name: string;
}