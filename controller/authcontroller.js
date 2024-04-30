// user contoller is nothing but a function which perform crud operations like creating a model from moongose schema or  updating deleting the models present in a database (known as collection)
const mongoose = require('mongoose');
const User = require("../models/Usermodel");
// express-Async-handler is a  optional thing , it actually take error from contoller part and send to middle ware for error/ exception handlings  
const asynchandler = require("express-async-handler");
const { generateToken } = require('../config/jwttoken');
const validatemongoid = require('../utils/validatemongoid');
const { refreshtoken } = require('../config/refreshtoken');
const jwt = require("jsonwebtoken");
// creating a user 

const createUser = asynchandler(async(req,res)=>{

    // before creating a user we need to check whether he is already registered or not 
    const email = req.body.email;
    const mobile = req.body.mobile;
    const finduser = await User.findOne({email:email}); 
    //if we do not found email in user collection in our data base we will create a document in user collection 
    if(!finduser){
        const newuser = User.create(req.body);
        res.json(newuser);
    }
    //else we will throw a error which will be catched by error handlers in middle ware 
    else{
        throw new Error("user already exist");
    }
    // if we do not wish to use middle-ware we can catch error like below but we then donot require async handlers so remove them first  
    // else{
    //     res.json({
    //         msg: "user already esist",
    //         status:500,
    //         success:false
    //     })
    // }
}
)

// login user 

const loginUser = asynchandler( async( req,res)=>{
    const{ email , password}= req.body;
    //console.log(email,password);
    const finduser = await User.findOne({email:email});
    if(finduser && await  finduser.isPasswordMatched(password)){
        const token = await refreshtoken(finduser?._id);
        const updateuser = await User.findByIdAndUpdate(finduser._id,{
            refreshtoken: token
        },{new:true})
        res.cookie('refreshtoken',token,{
            maxAge:72*60*60*1000
        })
        res.json({
            _id : finduser?._id,
            firstname:finduser?.firstname,
            lastname:finduser?.lastname,
            email:finduser?.email,
            password:finduser?.password,
            mobile:finduser?.mobile,
            role:finduser?.role,
            token : generateToken(finduser?._id)
        })
    }
    else{
        throw new Error(" invalid user credentials");
    } 
})

// reading data 
// now lets get values which we will require in our website

// getting list of all user signed-up in our website 

const getalluser = asynchandler( async(req,res)=>{
    try{
        const userlist = await User.find();
        res.json(userlist)
    }catch(error){
        throw new Error(error)
    }

})
// getting detail of a single user
const getuser = asynchandler( async(req,res)=>{
    try{
        const {id}=req.user;
        validatemongoid(id);
        const user = await User.findById(id);
        res.json(user)
    }catch(error){
        throw new Error("invalid id");
    }
})

// deleting a user
const deleteuser = asynchandler( async(req,res)=>{
    const {id}= req.params;
    validatemongoid(id);
    try{
        const deleteuser = await User.findByIdAndDelete(id);
        res.json(deleteuser)
    }
    catch(error){
        throw new Error("something went wrong");
    }
})
const checkvalidity =asynchandler(async(req,res)=>{
    res.send('user is a varified admin ');
})
// updating a user
const updateuser = asynchandler( async(req,res)=>{
    const {id} =req.user
    validatemongoid(id);
    try{
        const updateduser = await User.findByIdAndUpdate(id,{
            firstname: req?.body.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        },
        {new:true}
        );
        res.json(updateduser)
    }catch(error){
        throw new Error(error);
    }
})

// handling refesh token
const handleRefreshToken = asynchandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshtoken) throw new Error("No Refresh Token in Cookies");
    const refreshtoken = cookie.refreshtoken;
    const user = await User.findOne({ refreshtoken });
    if (!user) throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshtoken, process.env.secret_key, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  });

// logout
const logout = asynchandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie.refreshtoken){
        throw new error("token not found ")
    }
    const refreshtoken = cookie.refreshtoken;
    const finduser = await User.findOne({refreshtoken});
    if(!finduser){
        res.clearCookie("refreshtoken",{
            secure:true
        })
        res.sendStatus(204)
    }
    await User.findOneAndUpdate({refreshtoken},{
        refreshtoken:""
    })
    res.clearCookie("refreshtoken",{
        secure:true
    })
    res.sendStatus(204)
})
module.exports = {createUser,loginUser,getalluser,getuser,deleteuser,updateuser,handleRefreshToken,logout,checkvalidity};