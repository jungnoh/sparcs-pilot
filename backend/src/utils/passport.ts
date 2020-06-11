/* eslint-disable @typescript-eslint/no-explicit-any */
import {Strategy as LocalStrategy} from 'passport-local';
import * as UserService from 'services/user';
import Errors from '@common/literals/errors';
import { UserDoc } from 'models/User';

/**
 * @description Local authentication strategy
 */
export const localStrategy = new LocalStrategy({
  passReqToCallback: true,
  passwordField: 'password',
  usernameField: 'username'
}, async (_, username, password, done) => {
  try {
    const user = (await UserService.authenticate(username, password)).result;
    if (!user) {
      return done(Errors.WRONG_CREDENTIALS);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

/**
 * @description Serializes a `User` object to a `SerializedUser`
 * @param user `User` model object
 * @param done Callback function
 */
export const serialize = (user: UserDoc, done: any) => {
  done(null, user.username);
};

/**
 * @description Deserializes a `SerializedUser` to a `User` object
 * @param username `SerializedUser` seralized user
 * @param done Callback function
 */
export const deserialize = (username: string, done: any) => {
  UserService.view(username).then((result) => {
    if (!result.success) {
      console.error('Passport deserialize: User not found');
      done(null, {});
    } else {
      done(null, result.result);
    }
  });
};
