import Restaurant from '@common/models/Restaurant';
import {ObjectId} from 'bson';
import mongo from 'mongoose';

const schema = new mongo.Schema<Restaurant>({
  categories: {
    default: [],
    type: [{ref: 'FoodCategory', type: ObjectId}]
  },
  name: {required: true, type: String}
});

export type RestaurantDoc = Restaurant & mongo.Document;
const RestaurantModel = mongo.model<RestaurantDoc>('Restaurant', schema);
export default RestaurantModel;
