import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'


export const compareOtp=(otpData)=>{
   const {otp,otpToken} = otpData
   
   const tokenData = jwt.decode(otpToken)

   const hashOtp = tokenData.OTP

   const otpVerified = bcrypt.compareSync(otp,hashOtp)

   return otpVerified
}