const jwt = require("jsonwebtoken");
const refreshtoken= (id)=>{
    return jwt.sign({id},process.env.secret_key,{expiresIn:'3d'})
}
module.exports ={refreshtoken};