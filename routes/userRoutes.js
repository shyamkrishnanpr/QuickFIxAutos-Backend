import express from 'express'
const userRoutes = express.Router()
import verification from '../middlewares/user/userAuth.js'
import { signUp,verifyOtp,resendOtp,login,fetchServices,categoryData,vehicleData } from '../controllers/userController.js'

userRoutes.post('/signUp',signUp)
userRoutes.post('/verifyOtp',verifyOtp)
userRoutes.post('/resendOtp',resendOtp)
userRoutes.post('/login',login)

userRoutes.post('/services',fetchServices)
userRoutes.get('/categories',categoryData)

userRoutes.get('/vehicles',vehicleData)



export default userRoutes