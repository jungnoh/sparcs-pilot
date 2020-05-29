import { User } from '@common/models/User';
import mongo from 'mongoose';

const schema = new mongo.Schema<User>({
  dorm: {required: true, type: String},
  email: {required: true, type: String},
  name: {required: true, type: String},
  password: {required: true, type: String},
  phone: {required: true, type: String},
  username: {required: true, type: String},
}, {
  timestamps: true
});
schema.index('username');

export type UserDoc = User & mongo.TimestampedDocument;
const UserModel = mongo.model<UserDoc>('User', schema);
export default UserModel;
