// middleWare for auth
import jwt from "jsonwebtoken"
import { validateToken } from "../utils/jwt.js"
import { serverErrorResponse, unauthorizedResponse } from "../utils/response.js";

export const verifyToken = (req, res, next) => {
    let token = req.headers["access-token"];

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(token, 'LOGICLOSE', (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        req.uid = decoded.id;
        next();
    });
};

export const userValidate = (req, res, next) => {
    try {
        const valid = validateToken(req.headers.authorization, 'user');
        if (!valid || !['user', 'support', 'developer', 'admin', 'superAdmin'].includes(jwt.decode(req.headers.authorization)['role'])) {
            return unauthorizedResponse(res, "Access Denied")
        }
        req.userId = jwt.decode(req.headers.authorization)['userId'];
        next();
    } catch (error) {
        console.log("error", error.message);
        return serverErrorResponse(res, error.message);
    }
};

export const developerValidate = (req, res, next) => {
    try {
        const valid = validateToken(req.headers.authorization, 'developer');
        if (!valid || !['developer', 'admin', 'superAdmin'].includes(jwt.decode(req.headers.authorization)['role'])) {
            return unauthorizedResponse(res, "Access Denied")
        }
        req.userId = jwt.decode(req.headers.authorization)['userId'];
        next();
    } catch (error) {
        console.log(error.message);
        return serverErrorResponse(res, error.message);
    }
};

export const adminValidate = (req, res, next) => {
    try {
        const valid = validateToken(req.headers.authorization, 'admin');
        if (!valid) {
            return unauthorizedResponse(res, "Access Denied")
        }
        req.userId = jwt.decode(req.headers.authorization)['userId'];
        next();
    } catch (error) {
        console.log(error.message);
        return serverErrorResponse(res, error.message);
    }
};
