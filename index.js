const express = require('express')
const path = require('path')
const app = express()
const staticRouter = require('./routes/staticRouter.js')
const URL = require('./models/url.js')
const PORT = 3000
const urlRoute = require('./routes/url')
const { connectToMongoDB } = require('./connectMongoDB')

// connection to mongoDB
connectToMongoDB('mongodb://localhost:27017/short-url')
.then( () => console.log('MongoDB Connected Successfully'))
.catch( (err) => console.log("Error occurred" , err) )

// middlewares
app.set('view engine' , 'ejs')
app.set('views' , path.resolve('./views'))

app.use(express.json())
app.use(express.urlencoded({extended : false}))

// redirecting to the URL routes
app.use('/url' , urlRoute)
app.use('/' , staticRouter)

app.get('/test' , async (req , res) => {
    const allURLs = await URL.find({})
    return res.render('home' , {urls : allURLs})
})



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