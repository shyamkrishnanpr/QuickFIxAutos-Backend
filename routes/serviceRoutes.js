import express from "express";
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
  addService
} from "../controllers/serviceController.js";
const serviceRoute = express.Router();

serviceRoute.post("/signUp", signUp);
serviceRoute.post("/verifyOtp", verifyOtp);
serviceRoute.post("/login", login);
serviceRoute.post("/resendOtp", resendOtp);

serviceRoute.get("/vendorInfo/:id", vendorData);
serviceRoute.put("/updateProfile/:id", updateProfile);

serviceRoute.get("/category", categoryData);
serviceRoute.get("/subCategory", subCategoryData);
serviceRoute.get("/vehicles",vehicleData);

serviceRoute.post("/addService",addService)

export default serviceRoute;
