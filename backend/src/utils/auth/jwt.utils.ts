import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_DURATION_MINUTES } from '../../constants';
import { getExpirationTime } from '../time.utils';

export function generateJWT(uuid_user: string) {
    const { jwtString } = getExpirationTime(TOKEN_DURATION_MINUTES);
    const payload = { uuid_user };
    return jwt.sign(payload, JWT_SECRET, {expiresIn: jwtString});
}

export function validateJWT(token: string) {
    return jwt.verify(token, JWT_SECRET);
}