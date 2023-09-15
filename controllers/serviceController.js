import VendorModel from "../models/vendorSchema.js";
import CategoryModel from "../models/categorySchema.js";
import SubCategoryModel from "../models/subCategorySchema.js";
import VehicleModel from "../models/vehicleSchema.js";
import serviceModel from "../models/serviceSchema.js";
import BookingModel from "../models/bookingSchema.js";
import bcrypt from "bcrypt";
import { genSalt } from "bcrypt";
import { mailOtpGenerator } from "../helpers/nodeMailer/mailOtpGenerator.js";
import { response } from "express";
import { compareOtp } from "../helpers/nodeMailer/compareOtp.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const secretKey = process.env.JWT_SECRET;

//vendor registration controller

const signUp = async (req, res, next) => {
  try {
    let vendor = await VendorModel.findOne({
      $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }],
    });
    if (vendor) {
      return res.status(400).json({
        success: false,
        message: "vendor already exists",
      });
    }

    const { fullName, email, password, phoneNumber } = req.body;

    vendor = { fullName, email, password, phoneNumber };
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
      phoneNumber: tokenData.phoneNumber,
    });

    await vendor.save();

    const token = jwt.sign(
      { fullname: vendor.fullName, email: vendor.email, id: vendor._id },
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

const resendOtp = async (req, res, next) => {
  const { otpToken } = req.body;
  const data = jwt.decode(otpToken);
  const { fullName, email, password, phoneNumber } = data;

  const vendor = { fullName, email, password, phoneNumber };

  mailOtpGenerator(vendor).then((response) => {
    res.json({
      token: response,
    });
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("data in login", email, password);

    let vendor = await VendorModel.findOne({ email: email });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found.",
      });
    }
    let verified = bcrypt.compareSync(password, vendor.password);
    if (!verified) {
      return res.status(404).json({
        success: false,
        message: "incorrect password",
      });
    }

    if (vendor.isBlock) {
      console.log("Vendor is blocked");
      return res.status(403).json({
        success: false,
        message: "Vendor is blocked",
      });
    }

    const token = jwt.sign(
      { fullName: vendor.fullName, email: vendor.email, id: vendor._id },
      secretKey
    );

    return res.json({
      _id: vendor._id,
      success: true,
      token: token,
      message: "Login successfull",
    });
  } catch (error) {
    console.log(error);
  }
};

const vendorData = async (req, res, next) => {
  try {
    const id = req.vendorId;
    const vendorData = await VendorModel.findById({ _id: id }).select(
      "-password"
    );

    res.json(vendorData);
  } catch (error) {
    console.log("in cntrlle", error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log("in cntrlr", id);
    const updatedData = req.body;
    console.log("updated data is ", updatedData);
    console.log("Address Data:", updatedData.address);

    const vendor = await VendorModel.findById(id);

    vendor.fullName = updatedData.fullName;
    vendor.centerName = updatedData.centerName;
    vendor.latitude = updatedData.latitude;
    vendor.longitude = updatedData.longitude;
    vendor.address = updatedData.address;

    await vendor.save();

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log("error in contrlr", error);
  }
};

const categoryData = async (req, res, next) => {
  try {
    const category = await CategoryModel.find();
    res.json(category);
  } catch (error) {
    console.log(error);
  }
};

const subCategoryData = async (req, res, next) => {
  try {
    const selectedCategory = req.query.categoryId;
    const subcategories = await SubCategoryModel.find({
      categoryId: selectedCategory,
    });
    res.json(subcategories);
  } catch (error) {
    console.log(error);
  }
};

const vehicleData = async (req, res, next) => {
  try {
    const vehicles = await VehicleModel.find();
    res.json(vehicles);
  } catch (error) {
    console.log(error);
  }
};

const fetchService = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const page = req.query.page || 1;
    console.log("page", page);
    const perPage = req.query.perPage || 2;

    const services = await serviceModel
      .find({ vendorId: vendorId })
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("vehicleId")
      .skip((page - 1) * perPage)
      .limit(perPage);

    // console.log("at cntrller service fetched is ",services)
    res.json(services);
  } catch (error) {
    console.log(error);
  }
};

const addService = async (req, res, next) => {
  try {
    const {
      category,
      subCategory,
      vehicle,
      price,
      fuelOption,
      description,
      vendorId,
    } = req.body;

    console.log("data", req.body);

    const newService = new serviceModel({
      categoryId: category,
      subCategoryId: subCategory,
      vehicleId: vehicle,
      vendorId: vendorId,
      price: price,
      fuelOption: fuelOption,
      description: description,
    });

    const savedService = await newService.save();
    const populatedService = await serviceModel
      .findById(savedService._id)
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("vehicleId")
      .exec();

    res.json(populatedService);
  } catch (error) {
    console.log(error);
  }
};

const addSlots = async (req, res, next) => {
  const vendorId = req.vendorId;
  console.log(vendorId, "at add slot");
  const slotWithDates = req.body;

  console.log(req.body, "data at addslot");
  try {
    const vendor = await VendorModel.findById(vendorId);
    // console.log(vendor,"at cntrller vendor")

    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    Object.keys(slotWithDates).forEach((date) => {
      const slots = slotWithDates[date];
      console.log(slots, "slots at cntrller");
      const existingAvailability = vendor.availability.find(
        (availability) => availability.date === date
      );

      if (existingAvailability) {
        existingAvailability.slots.push(...slots, slots);
      } else {
        vendor.availability.push({ date, slot: slots });
      }
    });
    await vendor.save();
    res.status(200).json({ message: "Slots added successfully" });
  } catch (error) {
    console.log(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const vendorId = req.vendorId;
    const orders = await BookingModel.aggregate([
      {
        $match: { vendorId: new ObjectId(req.vendorId) },
      },
      {
        $lookup:{
          from:"users",
          localField:"userId",
          foreignField:"_id",
          as:"users"
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
          from: "subcategories",
          localField: "service.subCategoryId",
          foreignField: "_id",
          as: "subcategory",
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
          serviceId: 1,
          userId: 1,
          vendorId: 1,
          selectedDate: 1,
          selectedTimeSlot: 1,
          selectedAddress: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          status: 1,
          userName:{$arrayElemAt:["$users.fullName",0]},
          phoneNumber:{$arrayElemAt:["$users.phoneNumber",0]},
      
          service: {
            _id: 1,
            price: 1,
            description: 1,
            fuelOption: 1,
            isVerified: 1,
            category: { $arrayElemAt: ["$category.category", 0] },
            subcategory: { $arrayElemAt: ["$subcategory.subCategory", 0] },
            vehicle: { $arrayElemAt: ["$vehicle.brand", 0] },
          },
        },
      },
    ]);

    console.log(orders, "at controller");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  signUp,
  verifyOtp,
  login,
  vendorData,
  updateProfile,
  resendOtp,
  categoryData,
  subCategoryData,
  vehicleData,
  addService,
  fetchService,
  addSlots,
  getOrders,
};
