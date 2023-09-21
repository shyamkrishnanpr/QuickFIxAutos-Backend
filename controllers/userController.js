import UserModel from "../models/userSchema.js";
import VendorModel from "../models/vendorSchema.js";
import serviceModel from "../models/serviceSchema.js";
import VehicleModal from "../models/vehicleSchema.js";
import CategoryModel from "../models/categorySchema.js";
import BannerModel from "../models/bannerSchema.js";
import BookingModel from "../models/bookingSchema.js";
import bcrypt from "bcrypt";
import { mailOtpGenerator } from "../helpers/nodeMailer/mailOtpGenerator.js";
import { compareOtp } from "../helpers/nodeMailer/compareOtp.js";
import jwt from "jsonwebtoken";
import { response } from "express";
import geolib from "geolib";
import Razorpay from 'razorpay'
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;


const secretKey = process.env.JWT_SECRET;

// user registration controller

const signUp = async (req, res, next) => {
  try {
    let user = await UserModel.findOne({
      $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
    });
    if (user) {
      console.log("user already exist");
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    const { fullName, email, password, phoneNumber } = req.body;
    user = { fullName, email, password, phoneNumber };

    console.log(user);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    mailOtpGenerator(user).then((response) => {
      res.json({
        success: true,
        token: response,
      });
    });
  } catch (error) {
    console.log("error in controller", error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const otpData = req.body;
    const { otp, otpToken } = otpData;
    const otpVerified = compareOtp(otpData);
    if (!otpVerified)
      return res.status(400).json({
        success: false,
        message: "otp verification failed",
      });

    const tokenData = jwt.decode(otpToken);

    const user = new UserModel({
      fullName: tokenData.fullName,
      email: tokenData.email,
      password: tokenData.password,
      phoneNumber: tokenData.phoneNumber,
    });

    await user.save();

    const token = jwt.sign(
      { fullname: user.fullName, email: user.email, id: user._id },
      secretKey
    );

    return res.json({
      _id: user._id,
      success: true,
      token: token,
      message: "Successfully registered......",
    });
  } catch (error) {
    console.log("error in otp controller", error);
  }
};

const resendOtp = async (req, res, next) => {
  try {
    const { otpToken } = req.body;
    console.log("resend ", otpToken);
    const data = jwt.decode(otpToken);

    const { fullName, email, password, phoneNumber } = data;

    const user = { fullName, email, password, phoneNumber };

    mailOtpGenerator(user).then((response) => {
      res.json({
        token: response,
      });
    });
  } catch (error) {
    console.log("error in resend otp", error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("data in login", email, password);

    let user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Enter a valid email address.....",
      });
    }
    let verified = bcrypt.compareSync(password, user.password);
    if (!verified) {
      return res.status(404).json({
        success: false,
        message: "incorrect password",
      });
    }

    if (user.isBlock) {
      console.log("user is blocked");
      return res.status(403).json({ message: "User is blocked" });
    }

    const token = jwt.sign(
      { fullName: user.fullName, email: user.email, id: user._id,name:user.fullName },
      secretKey
    );

    return res.json({
      _id: user._id,
      success: true,
      token: token,
      message: "login successfull",
    });
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email address...",
      });
    }

    if (user.isBlock) {
      return res.status(404).json({
        success: false,
        message: "User is blocked",
      });
    }
    mailOtpGenerator(user).then((response) => {
      res.json({
        success: true,
        token: response,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyOtpForget = async (req, res, next) => {
  try {
    const otpData = req.body;

    const { otp, otpToken } = otpData;
    const otpVerified = compareOtp(otpData);
    if (!otpVerified)
      return res.status(400).json({
        success: false,
        message: "Enter a valid otp....",
      });

    return res.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password",
    });
  }
};

const fetchServices = async (req, res, next) => {
  try {
    const { userLocation } = req.body;
    const vehicleId = userLocation.vehicleId;
    // console.log("vehicleid is ", vehicleId);
    // console.log(req.body, "cntrller");
    const maxDistance = 10 * 5000;

    const vendors = await VendorModel.find();

    const nearByVendors = vendors.filter((vendor) => {
      const vendorLocation = {
        latitude: vendor.latitude,
        longitude: vendor.longitude,
      };

      const distance = geolib.getDistance(userLocation, vendorLocation);
      return distance <= maxDistance;
    });
    const services = [];

    for (const vendor of nearByVendors) {
      const vendorServices = await serviceModel
        .find({ vendorId: vendor._id, isVerified: true, vehicleId: vehicleId })
        .populate("vendorId")
        .populate("categoryId")
        .populate("subCategoryId")
        .populate("vehicleId");
      services.push(...vendorServices);
    }

    res.json(services);
  } catch (error) {
    console.log(error);
  }
};

const serviceDetailFetch = async (req, res, next) => {
  try {
    const { serviceId } = req.params;

    const serviceDetails = await serviceModel
      .find({ _id: serviceId })
      .populate("vendorId")
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("vehicleId");
 
    res.json(serviceDetails);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An internal server error occurred" });
  }
};

const categoryData = async (req, res, next) => {
  try {
    const category = await CategoryModel.find();
    // console.log(category,"cnt")
    res.json(category);
  } catch (error) {
    console.log(error);
  }
};

const vehicleData = async (req, res, next) => {
  try {
    const vehicles = await VehicleModal.find();
    res.json(vehicles);
  } catch (error) {
    console.log(error);
  }
};


const banners = async(req,res,next)=>{
  try {
    const banners = await BannerModel.find()
    console.log(banners,"atb")
    res.json(banners)
  } catch (error) {
    console.log(error)
  }
}


const booking = async(req,res,next)=>{
  try {
    const userId = req.userId

    console.log(userId,"at booking")
    const { serviceId,vendorId, selectedDate, selectedTimeSlot, selectedAddress, paymentMethod } = req.body;
    console.log(req.body,"atcntrl")

    const booking = new BookingModel({
      serviceId,
      vendorId,
      userId:userId,
      selectedDate,
      selectedTimeSlot,
      selectedAddress,
      paymentMethod,
      paymentStatus:"Pending"
    })

    await booking.save()

    res.status(201).json({ message: 'Booking successfully saved.' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'An error occurred while saving the booking.' });
  }
}

const payment = async(req,res,next)=>{
  try {
    const {order_id,amount,payment_capture} = req.body
    const razorpayInstance = new Razorpay({
      key_id:process.env.KEY_ID,
      key_secret:process.env.KEY_SECRET
    })

    const option = {
      receipt: order_id,
      amount: amount*100 ,
      currency: "INR",
      payment_capture: payment_capture,
    };
    const order = await razorpayInstance.orders.create(option);

    if (!order) {
      throw new Error("Failed to create order");
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.log(error)
  }
}

const confirmOrder = async(req,res,next)=>{
  try {
     const userId = req.userId

     console.log(userId,"at cntdd")

    const razorpayInstance = new Razorpay({
      key_id: process.env.KEY_ID,
      key_secret: process.env.KEY_SECRET,
    });
    const { orderId, packageDatas } = req.body;
    const {serviceId,selectedDate,selectedTimeSlot,selectedAddress,vendorId} = packageDatas
    console.log(packageDatas,"ctrl")
    const order = await razorpayInstance.orders.fetch(orderId);
    
    if (!order) return res.status(500).send("somthing error");


    if (order.status === "paid") {
      console.log("payment successs");

      const newOrder = new BookingModel({
      
        serviceId,
        vendorId,
        userId:userId,
        selectedDate,
        selectedTimeSlot,
        selectedAddress,
        paymentMethod:"Online",
        paymentStatus:"Paid"
      });
      newOrder
        .save()
        .then((data) => {
          res.status(200).json({ success: true, data: data });
        })
        .catch(() => {
          res.json({
            status: false,
            message: "order not placed",
          });
        });
    }
  } catch (error) {
    console.log(error)
  }
}

const runningOrdersFetch = async(req,res,next)=>{
  try {
    const userId = req.userId
  
    const orders = await BookingModel.aggregate([
      {
        $match: {
          status: "booked",
          userId:new ObjectId(userId)
        }
      },
   
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      {
        $unwind: "$service",
      },
      {
        $lookup: {
          from: "categories",
          localField: "service.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "service.vehicleId",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      {
        $project: {
          _id: 1,
          selectedDate: 1,
          selectedTimeSlot: 1,
          selectedAddress: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          status: 1,
          vehicleBrand:"$vehicle.brand",
          vehicleModel:"$vehicle.model",
          categoryName: "$category.category",
          Price:"$service.price"
      
        }
      }
    ])
  

     
    console.log(orders)
    
    res.json(orders)
  } catch (error) {
    console.log(error)
  }
}


const completedOrdersFetch = async(req,res,next)=>{
  try {
    const userId = req.userId
  
    const orders = await BookingModel.aggregate([
      {
        $match: {
          status: { $in: ["completed", "cancelled"] },
          userId:new ObjectId(userId)
        }
      },
   
      {
        $lookup: {
          from: "services",
          localField: "serviceId",
          foreignField: "_id",
          as: "service",
        },
      },
      {
        $unwind: "$service",
      },
      {
        $lookup: {
          from: "categories",
          localField: "service.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "vehicles",
          localField: "service.vehicleId",
          foreignField: "_id",
          as: "vehicle",
        },
      },
      {
        $project: {
          _id: 1,
          selectedDate: 1,
          selectedTimeSlot: 1,
          selectedAddress: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          status: 1,
          vehicleBrand:"$vehicle.brand",
          vehicleModel:"$vehicle.model",
          categoryName: "$category.category",
          Price:"$service.price"
      
        }
      }
    ])
  

     
    console.log(orders)
    
    res.json(orders)
  } catch (error) {
    console.log(error)
  }
}






export {
  signUp,
  verifyOtp,
  resendOtp,
  login,
  fetchServices,
  categoryData,
  vehicleData,
  forgotPassword,
  verifyOtpForget,
  resetPassword,
  serviceDetailFetch,
  banners,
  booking,
  payment,
  confirmOrder,
  runningOrdersFetch,
  completedOrdersFetch
};
