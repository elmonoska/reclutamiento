import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../constants';

export function generateJWT(uuid_user: string) {
    const payload = { uuid_user };
    return jwt.sign(payload, JWT_SECRET, {expiresIn: '30min'});
}

export function validateJWT(token: string) {
    return jwt.verify(token, JWT_SECRET);
}