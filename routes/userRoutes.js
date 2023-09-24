import express from "express";
const userRoutes = express.Router();
import verification from "../middlewares/user/userAuth.js";

import {
  signUp,
  verifyOtp,
  resendOtp,
  login,
  fetchServices,
  categoryData,
  vehicleData,
  forgotPassword,
  verifyOtpForget,
  resetPassword,
  serviceDetailFetch,
  banners,
  booking,
  payment,
  confirmOrder,
  runningOrdersFetch,
  completedOrdersFetch,
  cancelOrder
} from "../controllers/userController.js";

import { privateChat ,getChatConversation} from "../controllers/userChatController.js";

userRoutes.post("/signUp", signUp);
userRoutes.post("/verifyOtp", verifyOtp);
userRoutes.post("/resendOtp", resendOtp);
userRoutes.post("/login", login);
userRoutes.post("/forgotPassword",forgotPassword)
userRoutes.post("/verifyOtpForget",verifyOtpForget)
userRoutes.post("/resetPassword",resetPassword)
 
userRoutes.post("/services", fetchServices);
userRoutes.get("/serviceDetails/:serviceId",serviceDetailFetch)
userRoutes.get("/categories", categoryData);

userRoutes.get("/vehicles", vehicleData);
userRoutes.get("/getBanner",banners)

userRoutes.post("/booking",verification.verifyUser,booking)

userRoutes.post("/orders",verification.verifyUser,payment)
userRoutes.post("/order",verification.verifyUser,confirmOrder)
userRoutes.get("/runningOrders",verification.verifyUser,runningOrdersFetch)
userRoutes.get("/completedOrders",verification.verifyUser,completedOrdersFetch)
userRoutes.patch("/cancelOrder/:id",verification.verifyUser,cancelOrder)


userRoutes.post('/chat-sendmessage/:vendorId/:userId',privateChat);
userRoutes.get('/chat-conversations/:vendorId/:userId',getChatConversation);




export default userRoutes;
