import {compareSync, hashSync} from 'bcryptjs';

const jwt = require('jsonwebtoken');

export function generateToken(data: any) {
  const token = jwt.sign(
    Object.assign({}, data),
    process.env.JWT_TOKEN_SECRET,
    {expiresIn: process.env.JWT_EXPIRE_IN},
  );
  return token;
}

export function generateRefreshToken(data: any) {
  const token = jwt.sign(
    Object.assign({}, data),
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {expiresIn: process.env.JWT_EXPIRE_IN},
  );
  return token;
}

export function hashPassword(password: string) {
  return hashSync(password, 10);
}

export function comparePassword(password: string, hash: string | undefined) {
  if (!hash) return false;
  return compareSync(password, hash);
}
