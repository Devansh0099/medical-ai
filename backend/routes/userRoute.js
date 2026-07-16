const express=require("express")
const userModel = require("../models/user")

const router=express.Router()

router.post("/signup",async (req,res)=>{
    try {
        const { name, email, password, role } = req.body;

        console.log(req.body);

        const user = await userModel.create({
            name,
            email,
            password,
            role
        });

        return res.status(201).json({
            success: true,
            user
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
})

router.post("/signin",async(req,res)=>{
    try {
        const {email,password}=req.body;
        const { token, user } = await userModel.matchPassword(email, password);
        res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});
console.log("Set-Cookie Header:");
console.log(res.getHeader("Set-Cookie"));
        console.log(token)
        res.status(200).json({
            success: true,
            user,
        });
        console.log("token sent")
    } catch (error) {
        res.status(400).json({
        success:false,
        message:error.message
    })
    }
    
})

module.exports=router;