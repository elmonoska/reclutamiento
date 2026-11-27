import jwt from 'jsonwebtoken';
import { JWT_SECRET, TOKEN_DURATION_MINUTES } from '../../constants/index.constants';
import { getExpirationTime } from '../time.utils';

export function generateJWT(payload: { uuid_user: string; id_role?: number | null; role?: string }) {
    const { jwtString } = getExpirationTime(TOKEN_DURATION_MINUTES);
    return jwt.sign(payload, JWT_SECRET, {expiresIn: jwtString});
}

export function validateJWT(token: string) {
    return jwt.verify(token, JWT_SECRET);
}
