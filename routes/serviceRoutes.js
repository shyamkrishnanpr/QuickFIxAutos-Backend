import express from "express";
import { signUp, verifyOtp, login, vendorData,updateProfile,resendOtp} from "../controllers/serviceController.js";
const serviceRoute = express.Router();

serviceRoute.post("/signUp", signUp);
serviceRoute.post("/verifyOtp", verifyOtp);
serviceRoute.post("/login",login)
serviceRoute.post("/resendOtp",resendOtp)

serviceRoute.get("/vendorInfo/:id",vendorData)
serviceRoute.put("/updateProfile/:id",updateProfile)




export default serviceRoute;
 