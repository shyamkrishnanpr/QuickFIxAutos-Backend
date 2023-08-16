import express  from "express";
import dotenv from "dotenv"
import cors from 'cors'
import path from 'path';
import db from './config/config.js'

import adminRouter from './routes/adminRoutes.js';
import serviceRoute from "./routes/serviceRoutes.js";
import userRoutes from "./routes/userRoutes.js";



const app = express();
dotenv.config()
app.use(cors())
db()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))



app.use('/admin',adminRouter)
app.use('/vendor',serviceRoute)
app.use('/user',userRoutes)



   
const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
