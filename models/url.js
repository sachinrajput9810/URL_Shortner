const mongoose = require('mongoose')

const urlSchema = mongoose.Schema({
    shortID :{
        type : String ,
        required : true ,
        unique : true
    } ,
    redirectURL : {
        type : String ,
        required : true ,
    } ,
    visitedHistory : [ {timeStamp : {type : Number}} ] ,
    createdBy : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : 'users'
    }
} , {timeStamps : true})

const URL = mongoose.model('url' , urlSchema)

module.exports = URL