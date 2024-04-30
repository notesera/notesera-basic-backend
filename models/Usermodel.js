
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    refreshtoken: {
      type: "string",
    },
  },
  { timestamps: true }
);

// we will use middleware functionality 

// below is used to save a password in hash form 
userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSaltSync(10);
    this.password = await  bcrypt.hash(this.password,salt);

});
// retriving password and comparing with login passwword
userSchema.methods.isPasswordMatched = async function(enteredpassword){
    return await bcrypt.compare(enteredpassword,this.password)
};
module.exports = mongoose.model("User", userSchema);