import FoodCategory from '@common/models/FoodCategory';
import mongo from 'mongoose';

const schema = new mongo.Schema<FoodCategory>({
  key: {required: true, type: String},
  name: {required: true, type: String}
});
schema.index('key');

export type FoodCategoryDoc = FoodCategory & mongo.Document;
const FoodCategoryModel = mongo.model<FoodCategoryDoc>('FoodCategory', schema);
export default FoodCategoryModel;
