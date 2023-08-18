import UserModel from "../models/userSchema.js";
import bcrypt from 'bcrypt';
import { mailOtpGenerator } from "../helpers/nodeMailer/mailOtpGenerator.js";
import { compareOtp } from "../helpers/nodeMailer/compareOtp.js";
import jwt from "jsonwebtoken";
import { response } from "express";

const secretKey = process.env.JWT_SECRET

// user registration controller

const signUp = async(req,res,next)=>{
    try {
        let user = await UserModel.findOne({
            $or:[{email:req.body.email},{phoneNumber:req.body.phoneNumber}]
        })
        if(user){
            console.log("user already exist")
            return res.status(400).json({
                success:false,
                message:"user already exists"
            })
        }

        const { fullName, email, password, phoneNumber } = req.body;
        user = {fullName,email,password,phoneNumber}

        console.log(user)

        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(user.password,salt)

        mailOtpGenerator(user).then((response)=>{
            res.json({
                success:true,
                token:response
            })
        })
        
        
    } catch (error) {
        console.log("error in controller",error)
    }
}

const verifyOtp = async(req,res,next)=>{
    try {
        const otpData = req.body
        console.log("at controller ", otpData);
        const { otp, otpToken } = otpData;
          
        const otpVerified = compareOtp(otpData);
        if (!otpVerified)
          return res.status(400).json({
            success: false,
            message: "otp verification failed",
          });
    
        const tokenData = jwt.decode(otpToken);

        const user = new UserModel({
            fullName:tokenData.fullName,
            email:tokenData.email,
            password:tokenData.password,
            phoneNumber:tokenData.phoneNumber
        })

        await user.save()

        const token = jwt.sign(
            { fullname: user.fullName, email: user.email },
            secretKey
          );

          return res.json({
            _id: user._id,
            success: true,
            token: token,
            message: "Successfully registered......",
          });
        
    } catch (error) {
        console.log("error in otp controller",error)
    }
}


const resendOtp = async(req,res,next)=>{
    try {
        const {otpToken} = req.body
        console.log("resend ",otpToken)
        const data = jwt.decode(otpToken);


        const {fullName,email,password,phoneNumber} = data

        const user = {fullName,email,password,phoneNumber}

        mailOtpGenerator(user).then((response)=>{
            res.json({
                token:response

            })
        })

        
    } catch (error) {
        console.log("error in resend otp",error)
    }
}


const login = async (req, res, next) => {
    try {
      const {email,password} = req.body;
      console.log("data in login", email,password);
  
      let user = await UserModel.findOne({email:email})
      if(!user){
        console.log("invalid email")
      }
      let verified = bcrypt.compareSync(password,user.password)
      if(!verified){
        console.log("incorrect password")
      }
  
      const token = jwt.sign({fullName:user.fullName,email:user.email},secretKey)
       
      return res.json({
        _id:user._id,
        success:true,
        token:token,
        message:"login successfull"
      })
  
  
  
    } catch (error) {
      console.log(error);
    }
  };



export {signUp, verifyOtp, resendOtp,login}