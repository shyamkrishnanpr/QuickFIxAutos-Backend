import express from "express";
import { upload } from "../middlewares/multer/config.js";
import verification from '../middlewares/admin/adminAuth.js'
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
  deleteVehicle,
  fetchUsers,
  updateUsers,
  fetchVendors,
  updateVendors,
  getServices,
  verifyService
} from "../controllers/adminController.js";

const adminRoute = express.Router();

adminRoute.post("/login", login);

adminRoute.get("/category",verification.verifyAdmin,Category);
adminRoute.post("/addCategory",verification.verifyAdmin, addCategory);
adminRoute.put("/editCategory/:id",verification.verifyAdmin,editCategory)
adminRoute.delete("/deleteCategory/:id",verification.verifyAdmin,deleteCategory);

adminRoute.get("/subCategory",verification.verifyAdmin,subCategory)
adminRoute.post("/addSubcategory",verification.verifyAdmin,addSubCategory);
adminRoute.delete("/deleteSubCategory/:id",verification.verifyAdmin,deleteSubCategory)
adminRoute.put("/editSubCategory/:id",verification.verifyAdmin,editSubCategory)
 
adminRoute.get("/vehicles",verification.verifyAdmin,vehicles)
adminRoute.post("/addVehicle",upload.single('image'),verification.verifyAdmin,addVehicle)
adminRoute.delete("/deleteVehicle/:id",verification.verifyAdmin,deleteVehicle)

adminRoute.get("/users",verification.verifyAdmin,fetchUsers)
adminRoute.patch("/users/:id",verification.verifyAdmin,updateUsers)

adminRoute.get("/vendors",verification.verifyAdmin,fetchVendors)
adminRoute.patch("/vendors/:id",verification.verifyAdmin,updateVendors)

adminRoute.get("/getServices",verification.verifyAdmin,getServices)
adminRoute.patch("/verifyService/:id",verification.verifyAdmin,verifyService)


export default adminRoute;     
