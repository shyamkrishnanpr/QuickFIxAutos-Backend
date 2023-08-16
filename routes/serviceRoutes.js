import express from "express";
import { signUp, verifyOtp, login} from "../controllers/serviceController.js";
const serviceRoute = express.Router();

serviceRoute.post("/signUp", signUp);
serviceRoute.post("/verifyOtp", verifyOtp);
serviceRoute.post("/login",login)

export default serviceRoute;
 