import dotenv from 'dotenv';
dotenv.config();
import 'logger';
import mongoose from 'mongoose';
import winston from 'winston';
import FoodCategoryModel from 'models/FoodCategory';

async function run() {
  if (!process.env.MONGO_HOST) {
    winston.error('MONGO_HOST not found');
    process.exit(1);
  }
  await mongoose.connect(process.env.MONGO_HOST, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  // await FoodCategoryModel.deleteMany(await FoodCategoryModel.find({}));
  await FoodCategoryModel.insertMany([
    {key: 'chicken', name: '치킨'},
    {key: 'pizza', name: '피자'},
    {key: 'chinese', name: '중국집'},
    {key: 'meat', name: '고기'},
    {key: 'fish', name: '회'},
    {key: 'meet', name: '모여서 정해요'}
  ]);
}

run().then(() => null);