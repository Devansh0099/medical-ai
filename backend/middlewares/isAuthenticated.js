function isAuthenticated(req,res,next){

    if(!req.user){
        return res.status(401).json({
            success:false,
            message:"Login First"
        })
    }

    next()
}

module.exports = isAuthenticated