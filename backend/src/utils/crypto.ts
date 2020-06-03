import argon from 'argon2';

export const hashPassword = argon.hash;
export const verifyPassword = argon.verify;
