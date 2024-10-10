const express = require('express')
const app = express()
const URL = require('./models/url.js')
const PORT = 3000
const urlRoute = require('./routes/url')
const { connectToMongoDB } = require('./connectMongoDB')

// connection to mongoDB
connectToMongoDB('mongodb://localhost:27017/short-url')
.then( () => console.log('MongoDB Connected Successfully'))
.catch( (err) => console.log("Error occurred" , err) )

// middlewares
app.use(express.json())

// redirecting to the URL routes
app.use('/url' , urlRoute)

console.log()
app.get('/:shortID' ,async (req , res) => {
    const shortID = req.params.shortID
    const entry = await URL.findOneAndUpdate(
        {
            shortID
        } , 
        {
            $push : {
                visitedHistory : { 
                    timeStamp : Date.now()
                }
            }
        }
    )
    res.redirect(entry.redirectURL)
})
app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})