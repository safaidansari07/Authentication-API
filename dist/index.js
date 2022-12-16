"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(user_1.default);
const DB_URL = process.env.DB_URL;
// const url = 'mongodb://localhost:27017/test'
// mongodb connection
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.connect(DB_URL).then(() => {
    console.log('Connection Successful');
}).catch((error) => {
    console.log(error);
});
app.listen(3000, () => {
    console.log('server running at port number 3000 ');
});
