import jwt from "jsonwebtoken";
import CategoryModel from "../models/categorySchema.js";
import SubCategoryModel from "../models/subCategorySchema.js";
import VehicleModel from "../models/vehicleSchema.js";
import BannerModel from "../models/bannerSchema.js";
import UserModel from "../models/userSchema.js";
import VendorModel from "../models/vendorSchema.js";
import serviceModel from "../models/serviceSchema.js";
import { response } from "express";
import fs from "fs";

//admin login controller
const login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);
    if (
      email == process.env.ADMIN_EMAIL &&
      password == process.env.ADMIN_PASSWORD
    ) {
      const payload = {
        email: email,
        role:"admin"
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: 3600,
        },

        (err, token) => {
          console.log(token);
          if (err) {
            console.log("There is some error in token");
          } else {
            res.json({
              status: true,
              email: email,
              token: `Bearer ${token}`,
            });
          }
        }
      );
    } else {
      console.log("Incorrect password or email");
    }
  } catch (error) {
    console.log(error);
  }
};

//category management controller

const Category = async (req, res, next) => {
  try {
    const category = await CategoryModel.find();
    res.json(category);
  } catch (error) {
    console.log(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
    const {category} = req.body;
    console.log(category);

    const existingCategory = await CategoryModel.findOne({category})
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists.' });
    }



    CategoryModel.create(category);
    res.json(category);
  } catch (error) {
    console.log(error);
  }
};

const editCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { newName } = req.body;
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { category: newName },
      { new: true }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id);
    await CategoryModel.findByIdAndDelete({ _id: id });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

//subCategory management controller

const subCategory = async (req, res, next) => {
  try {
    const subCategory = await SubCategoryModel.find();
    res.json(subCategory);
  } catch (error) {
    console.log(error);
  }
};

const addSubCategory = async (req, res, next) => {
  try {
    const subCategory = req.body;
    console.log(subCategory);
    SubCategoryModel.create(subCategory);
    res.json(subCategory);
  } catch (error) {
    console.log(error);
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    await SubCategoryModel.findByIdAndDelete({ _id: id });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const editSubCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { newName } = req.body;
    const subCategory = await SubCategoryModel.findByIdAndUpdate(
      id,
      { subCategory: newName },
      { new: true }
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Vehicle management controller

const vehicles = async (req, res, next) => {
  try {
    const vehicles = await VehicleModel.find();

    res.json(vehicles);
  } catch (error) {
    console.log(error);
  }
};

const addVehicle = async (req, res, next) => {
  try {
    const vehicle = req.body;
    console.log(vehicle);
    vehicle.image = req.file.filename;
    console.log(vehicle.image);
    await VehicleModel.create(vehicle);
    res.json(vehicle);
  } catch (error) {
    console.log(error);
  }
};

const deleteVehicle = async (req, res, next) => {
  try {
    const id = req.params.id;

    await VehicleModel.findByIdAndDelete({ _id: id });
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const fetchUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

const updateUsers = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { isBlock } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { isBlock },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
  }
};

const fetchVendors = async (req, res, next) => {
  try {
    const vendors = await VendorModel.find();
    res.json(vendors);
  } catch (error) {
    console.log(error);
  }
};

const updateVendors = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { isBlock } = req.body;

    const updateVendor = await VendorModel.findByIdAndUpdate(
      id,
      { isBlock },
      { new: true }
    );
    res.json(updateVendor);
  } catch (error) {
    console.log(error);
  }
};

const getServices = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 3;
    const skip = (page - 1) * pageSize;
    const count = await serviceModel.find({isVerified:false}).count();
    const services = await serviceModel
      .find({ isVerified: false })
      .skip(skip)
      .limit(pageSize)
      .populate("vendorId")
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("vehicleId");
    // console.log("at cntrller",services)
    res.json({services,count});
  } catch (error) {
    console.log(error);
  }
};

const verifyService = async (req, res, next) => {
  try {
    const id = req.params.id;
    const response = await serviceModel.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );
    res.json(response);
  } catch (error) {
    console.log(error);
  }
};

const getAllService = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 3;
    const skip = (page - 1) * pageSize;
    const count = await serviceModel.find().count();

    const services = await serviceModel
      .find()
      .skip(skip)
      .limit(pageSize)
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("vehicleId")
      .populate("vendorId");

    res.json({ services, count });
  } catch (error) {
    console.log(error);
  }
};

const addBanner = async(req,res,next)=>{
  try {
    const banner = req.body
    banner.bannerImage = req.file.filename

    console.log(banner.bannerImage,"buuuu")
    
     await BannerModel.create(banner)
     res.json(banner)


    console.log(banner,"add banner cntroller")
  } catch (error) {
    console.log(error)
  }
}

const banners = async(req,res,next)=>{
  try {
    const banners = await BannerModel.find()
    console.log(banners,"atb")
    res.json(banners)
  } catch (error) {
    console.log(error)
  }
}



export {
  login,
  Category,
  addCategory,
  editCategory,
  deleteCategory,
  subCategory,
  addSubCategory,
  deleteSubCategory,
  editSubCategory,
  addVehicle,
  vehicles,
  deleteVehicle,
  fetchUsers,
  updateUsers,
  fetchVendors,
  updateVendors,
  getServices,
  verifyService,
  getAllService,
  addBanner,
  banners
};
