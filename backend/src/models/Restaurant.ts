import {ObjectId} from 'bson';
import mongo from 'mongoose';
import { FoodCategory } from './FoodCategory';
import { User } from './User';

export interface Restaurant {
  categories: FoodCategory[];
  createdBy?: User | ObjectId;
  name: string;
}

const schema = new mongo.Schema<Restaurant>({
  categories: {
    default: [],
    type: [{ref: 'FoodCategory', type: ObjectId}]
  },
  createdBy: {ref: 'User', type: ObjectId, required: false},
  name: {required: true, type: String}
});

export type RestaurantDoc = Restaurant & mongo.Document;
const RestaurantModel = mongo.model<RestaurantDoc>('Restaurant', schema);
export default RestaurantModel;
