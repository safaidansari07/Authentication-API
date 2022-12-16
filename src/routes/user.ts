
import { Router } from 'express';
import  {userModel} from '../models/user';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'  
import dotenv from 'dotenv' 
dotenv.config()
import { isAuth } from '../middleware/isAuth.js';
import { checkValidation } from '../middleware/validation.js';
import { rmSync } from 'fs';

const router = Router();


  
// console.log(process.env.SecretKey);
router.post(
  '/signup', checkValidation,
   (req,res,next)=>{

  const {name,email,password} = req.body;
   
  bcrypt
    .hash(password, 12)
    .then(hashedPass => {
      const user = new userModel({
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
      return res.status(500).send({message:'internal server error'})
    });
   }
);

router.post('/login',(req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let currentUser:any;
  userModel.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.status(404).send({message:'A user with this email could not be found.'})
      }
      
      currentUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
      

       return res.status(400).send({message:'Wrong password Please try Again '})
      
      }
      const token = jwt.sign(
        {
          email: currentUser.email,
          userId: currentUser._id.toString()
        },
        process.env.SecretKey,
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId:currentUser._id });
    })
    .catch(err => {
      return res.status(500).send({message:'internal server error'})
  
    });
  });


  router.get('/', async (req, res, next) => {
    try {
      const userData = await userModel.find({})
      if (!userData) {
          return res.status(404).send("User Not found")
      }
          res.send(userData);
     
  } catch (e) {
      res.send(e);
  }
  });
export default router;
