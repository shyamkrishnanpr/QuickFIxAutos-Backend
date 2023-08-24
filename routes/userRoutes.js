import express from 'express'
const userRoutes = express.Router()
import verification from '../middlewares/user/userAuth.js'
import { signUp,verifyOtp,resendOtp,login } from '../controllers/userController.js'

userRoutes.post('/signUp',signUp)
userRoutes.post('/verifyOtp',verifyOtp)
userRoutes.post('/resendOtp',resendOtp)
userRoutes.post('/login',login)



export default userRoutes