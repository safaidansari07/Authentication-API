"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../models/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isAuth_js_1 = require("../middleware/isAuth.js");
const validation_js_1 = require("../middleware/validation.js");
const router = (0, express_1.Router)();
// console.log(process.env.SecretKey);
router.post('/signup', validation_js_1.checkValidation, (req, res, next) => {
    const { name, email, password } = req.body;
    bcryptjs_1.default
        .hash(password, 12)
        .then(hashedPass => {
        const user = new user_1.userModel({
            email: email,
            password: hashedPass,
            name: name
        });
        return user.save();
    })
        .then(result => {
        res.status(201).json({ message: 'User Created!', userId: result._id });
    })
        .catch(err => {
        return res.status(500).send({ message: 'internal server error' });
    });
});
router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let currentUser;
    user_1.userModel.findOne({ email: email })
        .then(user => {
        if (!user) {
            return res.status(404).send({ message: 'A user with this email could not be found.' });
        }
        currentUser = user;
        return bcryptjs_1.default.compare(password, user.password);
    })
        .then(isEqual => {
        if (!isEqual) {
            return res.status(400).send({ message: 'Wrong password Please try Again ' });
        }
        const token = jsonwebtoken_1.default.sign({
            email: currentUser.email,
            userId: currentUser._id.toString()
        }, process.env.SecretKey, { expiresIn: '1h' });
        res.status(200).json({ token: token, userId: currentUser._id });
    })
        .catch(err => {
        return res.status(500).send({ message: 'internal server error' });
    });
});
router.get('/', isAuth_js_1.isAuth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield user_1.userModel.find({});
        if (!userData) {
            return res.status(404).send("User Not found");
        }
        res.send(userData);
    }
    catch (e) {
        res.send(e);
    }
}));
exports.default = router;
