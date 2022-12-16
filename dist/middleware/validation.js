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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkValidation = void 0;
const user_1 = require("../models/user");
const checkValidation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, confirm_password } = req.body;
    if (!(name && email && password && confirm_password)) {
        return res.status(400).send({ message: 'All Input is Required ' });
    }
    if (password != confirm_password) {
        return res.status(400).send({ message: ' password And confirm_password does not match ' });
    }
    let isUser = yield user_1.userModel.findOne({ email });
    if (isUser) {
        return res.status(400).send({
            message: "User Exists"
        });
    }
    next();
});
exports.checkValidation = checkValidation;
