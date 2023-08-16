import VendorModel from "../models/vendorSchema.js";
import bcrypt from "bcrypt";
import { genSalt } from "bcrypt";
import { mailOtpGenerator } from "../helpers/nodeMailer/mailOtpGenerator.js";
import { response } from "express";
import { compareOtp } from "../helpers/nodeMailer/compareOtp.js";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;

//vendor registration controller

const signUp = async (req, res, next) => {
  try {
    let vendor = await VendorModel.findOne({
      $or: [{ email: req.body.email }, { phoneNumber: req.body.phone }],
    });
    if (vendor) {
      console.log("vendor exists");
      return res.status(400).json({
        success: false,
        message: "vendor already exists",
      });
    }

    const { fullName, email, password, phone } = req.body;

    vendor = { fullName, email, password, phone };
    console.log(vendor);

    const salt = await bcrypt.genSalt(10);
    vendor.password = await bcrypt.hash(vendor.password, salt);

    mailOtpGenerator(vendor).then((response) => {
      res.json({
        success: true,
        token: response,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const otpData = req.body;
    console.log("at controller ", otpData);
    const { otp, otpToken } = otpData;

    const otpVerified = compareOtp(otpData);
    if (!otpVerified)
      return res.status(400).json({
        success: false,
        message: "otp verification failed",
      });

    const tokenData = jwt.decode(otpToken);

    const vendor = new VendorModel({
      fullName: tokenData.fullName,
      email: tokenData.email,
      password: tokenData.password,
    });

    await vendor.save();

    const token = jwt.sign(
      { fullname: vendor.fullName, email: vendor.email },
      secretKey
    );

    return res.json({
      _id: vendor._id,
      success: true,
      token: token,
      message: "Successfully registered......",
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res, next) => {
  try {
    const {email,password} = req.body;
    console.log("data in login", email,password);

    let vendor = await VendorModel.findOne({email:email})
    if(!vendor){
      console.log("invalid email")
    }
    let verified = bcrypt.compareSync(password,vendor.password)
    if(!verified){
      console.log("incorrect password")
    }

    const token = jwt.sign({fullName:vendor.fullName,email:vendor.email},secretKey)
     
    return res.json({
      _id:vendor._id,
      success:true,
      token:token,
      message:"login successfull"
    })



  } catch (error) {
    console.log(error);
  }
};

export { signUp, verifyOtp, login };
  