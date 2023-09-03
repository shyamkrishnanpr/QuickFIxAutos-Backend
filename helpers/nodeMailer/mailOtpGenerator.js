import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function generateOtp(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(min + Math.random() * (max - min + 1));
}

function expirationTime(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export const mailOtpGenerator = async (data) => {
  try {
    // console.log("data in mail", data);
    const email = data.email;

    const otp = generateOtp(6);
    // console.log(otp);

    const now = new Date();
    const expireTime = expirationTime(now, 1);
    console.log(expireTime);

    const salt = await bcrypt.genSalt(10);
    const otpEncrypt = await bcrypt.hash(otp.toString(), salt);
    // console.log(otpEncrypt);

    data = { ...data, otpEncrypt, expireTime };
    // console.log(data)

    const otpSecretKey = process.env.JWT_SECRET;
    const otpToken = jwt.sign({
      fullName: data.fullName,
      email: data.email,
      password:data.password,
      phoneNumber:data.phoneNumber,
      OTP:data.otpEncrypt,
      expirationTime:data.expireTime
    },otpSecretKey);

  //  console.log(otpToken)


   const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {  
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASS,
    }
  });

  const mailOptions = {
    from: process.env.MAILER_EMAIL ,
    to: `${email}`,
    subject: 'OTP Verification',
    text: `Your OTP for verification is: ${otp}`
  };

  await transporter.verify();


  const response = await new Promise((resolve,reject)=>{
    transporter.sendMail(mailOptions,(err,info)=>{
        if (err) {
            console.log("error in send mail",err)
            reject(err)
        } else {
            // console.log("Mail send succesfully",info)
            resolve(otpToken)
        }
    }) 
  })

  return response

  } catch (error) {
    console.log("error in otp generator", error);
  }
};
