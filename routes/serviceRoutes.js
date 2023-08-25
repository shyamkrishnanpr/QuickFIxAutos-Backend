import express from "express";
import verification from '../middlewares/vendor/vendorAuth.js'
import {
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
} from "../controllers/serviceController.js";
const serviceRoute = express.Router();

serviceRoute.post("/signUp", signUp);
serviceRoute.post("/verifyOtp", verifyOtp);
serviceRoute.post("/login", login);
serviceRoute.post("/resendOtp", resendOtp);  

serviceRoute.get("/vendorInfo/:id",verification.verifyVendor,vendorData);
serviceRoute.put("/updateProfile/:id",verification.verifyVendor,updateProfile);

serviceRoute.get("/category",verification.verifyVendor,categoryData);
serviceRoute.get("/subCategory",verification.verifyVendor,subCategoryData);
serviceRoute.get("/vehicles",verification.verifyVendor,vehicleData);

serviceRoute.post("/addService",verification.verifyVendor,addService);
serviceRoute.get("/getServices",verification.verifyVendor, fetchService);

export default serviceRoute;
