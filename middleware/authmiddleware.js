const User = require("../models/Usermodel");
const jwt = require("jsonwebtoken");
const asynchandler = require("express-async-handler");

const authMiddleware = asynchandler( async(req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token=req?.headers?.authorization.split(" ")[1]
        try{
            if(token){
                const decoded = jwt.verify(token,process.env.secret_key)
                //console.log(decoded)
                const finduser = await User.findById(decoded?.id)
                req.user = finduser
                next();
            }
        }
        catch(error){
            throw new Error("not a authorized token please login again!");
        }
    }else{
        throw new Error("no token attached with request");
    }
})
const isAdmin = asynchandler( async(req,res,next)=>{
    //console.log(req.user);
    const{email}= req.user
    const findadmin = await User.findOne({email:email})
    if(findadmin.role !=="admin"){
        throw new Error("not a verified admin!!")
    }
    else{
       next();
    }
})
module.exports=  {authMiddleware,isAdmin};