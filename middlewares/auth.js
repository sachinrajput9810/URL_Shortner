const {getUser} = require('../service/auth')

function checkForAuthentication(req , res , next){
    const cookieToken = req.cookies?.token
    req.user = null 
    if(!cookieToken) return next()
    const token = cookieToken
    const user = getUser(token)
    req.user = user 
    return next()
}

function restrictTo(roles){
    return function(req , res , next){
        if(!req.user) res.redirect("/login")
        if(!roles.includes(req.user.role)) return res.end("Unauthorized User")
        return next()
    }
}

module.exports = {
    checkForAuthentication ,
    restrictTo  ,
}