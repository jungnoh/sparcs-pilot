import mongo from 'mongoose';

/**
 * @description 사용자 모델 중 공개되어도 괜찮은 정보
 */
export interface UserProfile {
  // 사용자명
  username: string;
  // 기숙사 (또는 거주위치)
  dorm: string;
  // 이메일
  email: string;
  // 이름
  name: string;
  // 전화번호
  phone: string;
}

export interface UserSignup extends UserProfile {
  // 비밀번호
  password: string;
}

/**
 * @description 사용자 모델
 */
export interface User extends UserSignup {
  // 생성일자
  createdAt: Date;
}


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
