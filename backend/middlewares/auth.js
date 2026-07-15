const { validateToken } = require("../services/authentication")

function checkForAuth(cookie){
    return (req,res,next)=>{
        const token=req.cookies[cookie]
        if(!token){
            req.user=null;
            return next()
        }
        try {
            const user=validateToken(token)
            req.user=user
        } catch(error){
            res.clearCookie("token");
        }
        return next()
    }
}

module.exports=checkForAuth