const URL = require('../models/url')
async function handleGenerateNewShortURL(req , res){
    const {nanoid} = await import('nanoid')
    const body = req.body 
    if(!body.url) return res.status(400).json({error : 'URL is required'})

    const shortID = nanoid(8)
    URL.create({
        shortID : shortID ,
        redirectURL : body.url ,
        visitedHistory : [] , 
        createdBy : req.user._id
    })
    return res.render('home' , {id : shortID})
}

async function handleGetAnalytics(req , res){
    const shortID = req.params.shortID 
    const result = await URL.findOne({shortID})
    return res.json({
        totalClicks : result.visitedHistory.length ,
        analytics : result.visitedHistory
    })
}

module.exports = {
    handleGenerateNewShortURL ,
    handleGetAnalytics ,
}