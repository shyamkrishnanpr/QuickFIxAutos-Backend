import express from "express";
import { upload } from "../middlewares/multer/config.js";
import {
  login,
  Category,
  addCategory,
  deleteCategory,
  subCategory,
  addSubCategory,
  deleteSubCategory,
  editSubCategory,
  editCategory,
  addVehicle,
  vehicles,
  deleteVehicle
} from "../controllers/adminController.js";

const adminRoute = express.Router();

adminRoute.post("/login", login);

adminRoute.get("/category", Category);
adminRoute.post("/addCategory", addCategory);
adminRoute.put("/editCategory/:id",editCategory)
adminRoute.delete("/deleteCategory/:id", deleteCategory);

adminRoute.get("/subCategory",subCategory)
adminRoute.post("/addSubcategory",addSubCategory);
adminRoute.delete("/deleteSubCategory/:id",deleteSubCategory)
adminRoute.put("/editSubCategory/:id",editSubCategory)

adminRoute.get("/vehicles",vehicles)
adminRoute.post("/addVehicle",upload.single('image'),addVehicle)
adminRoute.delete("/deleteVehicle/:id",deleteVehicle)

export default adminRoute;     
