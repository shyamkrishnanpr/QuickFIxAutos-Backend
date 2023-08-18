import express from "express";
import { signUp, verifyOtp, login, vendorData} from "../controllers/serviceController.js";
const serviceRoute = express.Router();

serviceRoute.post("/signUp", signUp);
serviceRoute.post("/verifyOtp", verifyOtp);
serviceRoute.post("/login",login)

serviceRoute.get("/vendorInfo/:id",vendorData)

export default serviceRoute;
 