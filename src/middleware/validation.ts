
import { userModel } from "../models/user";
const checkValidation = async(req,res,next)=>{

    const{name,email,password,confirm_password } = req.body; 
    
    if(!(name && email && password && confirm_password)){
       return res.status(400).send({message: 'All Input is Required '});
    
    }
    
    if(password != confirm_password){
       return res.status(400).send({message: ' password And confirm_password does not match '});  
    }
    
    let isUser = await userModel.findOne({email})
    if(isUser){
        return res.status(400).send({
            message:"User Exists"
        })
    }
    next()
}


export{checkValidation}