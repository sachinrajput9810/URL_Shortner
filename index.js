const express = require('express')
const path = require('path')
const app = express()
const cookieParser = require('cookie-parser')
const URL = require('./models/url.js')
const PORT = 3000

const {checkForAuthentication , restrictTo} = require('./middlewares/auth.js')
const { connectToMongoDB } = require('./connectMongoDB')


//Routers
const staticRouter = require('./routes/staticRouter.js')
const urlRoute = require('./routes/url')
const userRouter = require('./routes/user.js')

// connection to mongoDB
connectToMongoDB('mongodb://localhost:27017/short-url')
.then( () => console.log('MongoDB Connected Successfully'))
.catch( (err) => console.log("Error occurred" , err) )

// middlewares
app.set('view engine' , 'ejs')
app.set('views' , path.resolve('./views'))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(checkForAuthentication)

// redirecting to the URL routes
app.use('/url' , restrictTo(['NORMAL']) , urlRoute)
app.use('/'  ,  staticRouter)
app.use('/user' , userRouter)


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
        } , {new : true}
    )
    
    if (!entry) {
        return res.status(404).send('URL not found');
    }
    return  res.redirect(entry.redirectURL);
})
app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`)
})