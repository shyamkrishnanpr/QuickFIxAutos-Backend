import jwt from "jsonwebtoken";
import CategoryModel from "../models/categorySchema.js";
import SubCategoryModel from "../models/subCategorySchema.js";
import VehicleModel from "../models/vehicleSchema.js";
import BannerModel from "../models/bannerSchema.js";
import UserModel from "../models/userSchema.js";
import VendorModel from "../models/vendorSchema.js";
import serviceModel from "../models/serviceSchema.js";
import BookingModel from "../models/bookingSchema.js";
import { response } from "express";
import fs from "fs";
import { pipeline } from "stream";

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
        role: "admin",
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
    const category = req.body;
    console.log(category);
    const check = category.category;

    const existingCategory = await CategoryModel.findOne({ category: check });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists." });
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
    const existingCategory = await CategoryModel.findOne({ category: newName });
    if (existingCategory) {
      return res.status(400).json({ error: "Category name already exists." });
    }

    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { category: newName },
      { new: true }
    );
    res.json(category);
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
    const count = await serviceModel.find({ isVerified: false }).count();
    const services = await serviceModel
      .find({ isVerified: false })
      .skip(skip)
      .limit(pageSize)
      .populate("vendorId")
      .populate("categoryId")
      .populate("subCategoryId")
      .populate("vehicleId");
    // console.log("at cntrller",services)
    res.json({ services, count });
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

const addBanner = async (req, res, next) => {
  try {
    const banner = req.body;
    banner.bannerImage = req.file.filename;

    console.log(banner.bannerImage, "buuuu");

    await BannerModel.create(banner);
    res.json(banner);

    console.log(banner, "add banner cntroller");
  } catch (error) {
    console.log(error);
  }
};

const banners = async (req, res, next) => {
  try {
    const banners = await BannerModel.find();
    console.log(banners, "atb");
    res.json(banners);
  } catch (error) {
    console.log(error);
  }
};

const dashboardData = async (req, res, next) => {
  try {
    const totalUsers = await UserModel.countDocuments({
      isBlock: false,
    });

    const totalVendors = await VendorModel.countDocuments({
      isBlock: false,
    });

    const totalbookings = await BookingModel.countDocuments();

    const totalServices = await serviceModel.countDocuments({
      isVerified: true,
    });

    const data = {
      totalUsers,
      totalVendors,
      totalbookings,
      totalServices,
    };

    res.json(data);
  } catch (error) {
    console.log(error);
  }
};

const displayCharts = async (req, res, next) => {
  try {
    const FIRST_MONTH = 1;
    const LAST_MONTH = 12;
    const TODAY = new Date();
    const YEAR_BEFORE = new Date(TODAY);
    YEAR_BEFORE.setFullYear(YEAR_BEFORE.getFullYear() - 1);
    console.log(TODAY, YEAR_BEFORE);
    const MONTHS_ARRAY = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const pipeLine = [
      {
        $match: {
          createdAt: { $gte: YEAR_BEFORE, $lte: TODAY },
        },
      },
      {
        $group: {
          _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year_month": 1 },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          month_year: {
            $concat: [
              {
                $arrayElemAt: [
                  MONTHS_ARRAY,
                  {
                    $subtract: [
                      { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                      1,
                    ],
                  },
                ],
              },
              "-",
              { $substrCP: ["$_id.year_month", 0, 4] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { k: "$month_year", v: "$count" } },
        },
      },
      {
        $addFields: {
          start_year: { $substrCP: [YEAR_BEFORE, 0, 4] },
          end_year: { $substrCP: [TODAY, 0, 4] },
          months1: {
            $range: [
              { $toInt: { $substrCP: [YEAR_BEFORE, 5, 2] } },
              { $add: [LAST_MONTH, 1] },
            ],
          },
          months2: {
            $range: [
              FIRST_MONTH,
              { $add: [{ $toInt: { $substrCP: [TODAY, 5, 2] } }, 1] },
            ],
          },
        },
      },
      {
        $addFields: {
          template_data: {
            $concatArrays: [
              {
                $map: {
                  input: "$months1",
                  as: "m1",
                  in: {
                    count: 0,
                    month_year: {
                      $concat: [
                        {
                          $arrayElemAt: [
                            MONTHS_ARRAY,
                            { $subtract: ["$$m1", 1] },
                          ],
                        },
                        "-",
                        "$start_year",
                      ],
                    },
                  },
                },
              },
              {
                $map: {
                  input: "$months2",
                  as: "m2",
                  in: {
                    count: 0,
                    month_year: {
                      $concat: [
                        {
                          $arrayElemAt: [
                            MONTHS_ARRAY,
                            { $subtract: ["$$m2", 1] },
                          ],
                        },
                        "-",
                        "$end_year",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
      {
        $addFields: {
          data: {
            $map: {
              input: "$template_data",
              as: "t",
              in: {
                k: "$$t.month_year",
                v: {
                  $reduce: {
                    input: "$data",
                    initialValue: 0,
                    in: {
                      $cond: [
                        { $eq: ["$$t.month_year", "$$this.k"] },
                        { $add: ["$$this.v", "$$value"] },
                        { $add: [0, "$$value"] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          data: { $arrayToObject: "$data" },
          _id: 0,
        },
      },
    ];

    const serviceChart = await serviceModel.aggregate(pipeLine);
    const bookingChart = await BookingModel.aggregate(pipeLine)
    const usersChart = await UserModel.aggregate(pipeLine)
    const vendorChart = await VendorModel.aggregate(pipeLine)

    res.json({
      serviceChart,
      bookingChart,
      usersChart,
      vendorChart
    });
  } catch (error) {
    console.log(error);
  }
};

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
  banners,
  dashboardData,
  displayCharts,
};
