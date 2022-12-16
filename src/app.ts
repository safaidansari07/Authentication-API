import  mongoose  from 'mongoose';
import express from 'express';
import bodyParser, { text } from 'body-parser';

import userRoutes from './routes/user';


const app = express(); 
 

app.use(bodyParser.json());

app.use(userRoutes);
const DB_URL = process.env.DB_URL;
// const url = 'mongodb://localhost:27017/test'
// mongodb connection
mongoose.set('strictQuery',true);
mongoose.connect(DB_URL).then(()=>{
    console.log('Connection Successful');
}).catch((error)=>{
    console.log(error);
})

app.listen(3000,()=>{
    console.log('server running at port number 3000 ');
});
