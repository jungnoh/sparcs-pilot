import FoodCategory from './FoodCategory';

export default interface Restaurant {
  categories: FoodCategory[];
  name: string;
}