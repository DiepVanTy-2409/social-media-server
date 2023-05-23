import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import AuthRoute from './Routes/AuthRoute.js'
import UserRoute from './Routes/UserRoute.js'
import PostRoute from './Routes/PostRoute.js'
import UploadRoute from './Routes/UploadRoute.js'
import ChatRoute from './Routes/ChatRoute.js'
import MessageRoute from './Routes/MessageRoute.js'
import cors from 'cors'

const app = express();


//to serve images for public
app.use(express.static('public'))
app.use('/images', express.static('images'))


dotenv.config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))

//mongodb
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB)
    } catch (error) {
        console.log(error)
    }
}
connect();

// usage of routes
app.use('/auth', AuthRoute)
app.use('/user', UserRoute)
app.use('/posts', PostRoute)
app.use('/upload', UploadRoute)
app.use('/chat', ChatRoute)
app.use('/message', MessageRoute)
// listen
app.listen(port, () => console.log(`server on port ${port}`))