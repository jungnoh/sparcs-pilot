import UserModel, {UserDoc, UserSignup, UserProfile} from 'models/User';
import { ServiceResult } from 'utils/types';
import * as Crypto from 'utils/crypto';

export async function authenticate(username: string, password: string): ServiceResult<void, UserDoc> {
  const user = await UserModel.findOne({username});
  if (!user) return {success: true};
  if (!(await Crypto.verifyPassword(user.password, password))) {
    return {success: true};
  }
  return {success: true, result: user};
}

/**
 * @description 사용자 정보를 반환합니다.
 * @param username 사용자명
 */
export async function view(username: string):
ServiceResult<'USER_NEXIST', UserDoc> {
  const user = await UserModel.findOne({username});
  if (!user) {
    return {success: false, reason: 'USER_NEXIST'};
  }
  return {success: true, result: user};
}

/**
 * @description 사용자를 생성합니다.
 * @param profile 생성할 사용자 프로필
 */
export async function create(profile: UserSignup):
ServiceResult<'USERNAME_EXISTS' | 'EMAIL_EXISTS', UserDoc> {
  // 이메일, 사용자명이 존재하는지 체크
  const existingUser = await UserModel.findOne({$or: [
    {username: profile.username},
    {email: profile.email},
  ]});
  if (existingUser !== null) {
    if (existingUser.username === profile.username) {
      return {
        success: false,
        reason: 'USERNAME_EXISTS'
      };
    } else if (existingUser.email === profile.email) {
      return {
        success: false,
        reason: 'EMAIL_EXISTS'
      };
    }
  }
  const userObj = await UserModel.create(Object.assign(profile, {
    password: await Crypto.hashPassword(profile.password),
  }));
  return {
    success: true,
    result: userObj
  };
}

export async function update(username: string, profile: Partial<UserProfile>, password?: string):
ServiceResult<'USER_NEXIST'> {
  const userObj = await UserModel.findOne({username});
  if (!userObj) {
    return {reason: 'USER_NEXIST', success: false};
  }
  Object.assign(userObj, profile);
  if (password !== undefined) {
    userObj.password = await Crypto.hashPassword(password);
  }
  await userObj.save();
  return {success: true};
}
