import jwt from 'jsonwebtoken';
import { getKey } from './secret';

export const verifyToken = token => new Promise(((resolve, reject) => {
    jwt.verify(token, getKey, (err, decoded) => err || !decoded
        ? reject(err)
        : resolve({ ...decoded, id: decoded.sub || decoded.id }));
}));