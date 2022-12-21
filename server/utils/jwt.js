import jwt from 'jsonwebtoken'
import {
    USER_SIGNING_KEY,
    DEVELOPER_USER_SIGNING_KEY,
    ADMIN_SIGNING_KEY
} from "./config.js"

import JWT_EXPIRY_CONSTANT from "./constants.js"

const keyMap = {
    user: USER_SIGNING_KEY,
    developer: DEVELOPER_USER_SIGNING_KEY,
    admin: ADMIN_SIGNING_KEY,
}

export const validateToken = (token, type) => {
    const key = keyMap[type];
    return jwt.verify(token, key) && jwt.decode(token)['role'] === type; // && jwt.decode(token)['role'] === type;
}

export const signToken = (userId, type) => {
    const payload = {
        role: type,
        userId: userId,
        creationTimestamp: Date.now(),
        exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY_CONSTANT[type],
    }
    // sign jwt token
    const key = keyMap[type];
    return jwt.sign(payload, key);
}