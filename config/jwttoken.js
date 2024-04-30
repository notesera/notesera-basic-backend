// in this file we are going to generate web token 
// web token is nothing but a unique key to track user , it has many features one of the feature is " expiryIN"
// this feature provide a expery time of this unique token 
const jwt = require("jsonwebtoken");

// creating a function which generate web token we will use our database document id which will help as to attach a token with document

const generateToken = (id)=>{
    return jwt.sign({id},process.env.secret_key,{expiresIn:"1d"})
    // sign function will take 3 parameter 
    //1) a payload like id(remember its a opject not a string ) 2) a secret key which only server manager knows 3) options it can be like exper time or any other functionality we want to provide in token
}

module.exports ={generateToken}