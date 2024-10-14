const jwt = require('jsonwebtoken')
const secretKey = "Albert9313@"
function setUser(user){
    return jwt.sign({
        _id : user._id ,
        email : user.email ,
        role : user.role ,
    } , secretKey)
}

function getUser(token){
    if(!token) return null
    try {
        return jwt.verify(token , secretKey)
    } catch (error) {
        console.log("Tokken Error" , error)
        return null
    }
}

module.exports = {
    setUser ,
    getUser  ,
}