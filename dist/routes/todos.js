"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const check_1 = require("express-validator/check");
const todo_js_1 = __importDefault(require("../models/todo.js"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import mongoose from 'mongoose';
// import { register } from '../controllers/user';
// import userController from '../controllers/user';
const router = (0, express_1.Router)();
router.get('/', (req, res, next) => {
});
router.post('/signup', [
    (0, check_1.body)('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .custom((value, { req }) => {
        return todo_js_1.default.findOne({ email: value }).then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-Mail address already exists!');
            }
        });
    })
        .normalizeEmail(),
    (0, check_1.body)('password')
        .trim()
        .isLength({ min: 5 }),
    (0, check_1.body)('name')
        .trim()
        .not()
        .isEmpty()
], (req, res, next) => {
    const errors = (0, check_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcryptjs_1.default
        .hash(password, 12)
        .then(hashedPw => {
        const user = new todo_js_1.default({
            email: email,
            password: hashedPw,
            name: name
        });
        return user.save();
    })
        .then(result => {
        res.status(201).json({ message: 'User created!', userId: result._id });
    })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
});
router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    todo_js_1.default.findOne({ email: email })
        .then(user => {
        if (!user) {
            const error = new Error('A user with this email could not be found.');
            throw error;
        }
        loadedUser = user;
        return bcryptjs_1.default.compare(password, user.password);
    })
        .then(isEqual => {
        if (!isEqual) {
            const error = new Error('Wrong password!');
            throw error;
        }
        const token = jsonwebtoken_1.default.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, 'somesupersecretsecret', { expiresIn: '1h' });
        res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    })
        .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
});
exports.default = router;
