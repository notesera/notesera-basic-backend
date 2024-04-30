const mongoose = require("mongoose")

const validatemongoid = (id)=>{
    const isvalid =  mongoose.Types.ObjectId.isValid(id);
    if(!isvalid){
        throw new Error("not a valid mongo id!");
    }
};

module.exports = validatemongoid;