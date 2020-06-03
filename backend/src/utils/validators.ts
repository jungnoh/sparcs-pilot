import { body } from 'express-validator';

// 사용자 정보 변경시 사용하는 validator (주소정보 제외)
export const userEditVal = [
  body('name').exists().notEmpty(),
  body('phone').exists().notEmpty(),
  body('email').exists().isEmail(),
  body('dorm').exists().notEmpty(),
  body('username').exists().isLength({min: 8}),
  body('password').isLength({min: 8})
];

// 사용자 회원가입시 사용하는 validator (주소정보 제외)
export const userSignupVal = [
  ...userEditVal,
  body('password').exists().isLength({min: 8}),
];
