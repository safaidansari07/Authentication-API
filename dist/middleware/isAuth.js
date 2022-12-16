"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        return res.status(401).send('Not Authenticated ');
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(token, 'safaidansari');
    }
    catch (err) {
        return res.status(500).send('Internal Server Error ');
    }
    if (!decodedToken) {
        return res.status(401).send('Not Authenticated ');
    }
    req.userId = decodedToken.userId;
    next();
};
exports.isAuth = isAuth;
