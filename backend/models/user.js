const mongoose=require("mongoose");
const { createToken } = require("../services/authentication");
const bcrypt=require("bcryptjs");

const schema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:["patient","doctor","admin"],
        default:"patient"
    },
    password:{
        type:String,
        required:true
    }
})

schema.pre("save",async function(){
    if(!this.isModified("password")) return ;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    
})

schema.static("matchPassword",async function(email,password){
    const user=await this.findOne({email})
    if (!user) throw new Error("user not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid password");
    }

    const token=createToken(user)
    return {token,user}

})

const userModel=mongoose.model('User',schema)

module.exports=userModel