import argon from 'argon2';
import crypto from 'crypto';

export const hashPassword = argon.hash;
export const verifyPassword = argon.verify;

export function randomString(bytes: number) {
  return crypto.randomBytes(bytes).toString('hex');
}
