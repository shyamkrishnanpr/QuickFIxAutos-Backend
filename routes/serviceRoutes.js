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
  addSlots,
  getOrders,
  updateOrder
} from "../controllers/serviceController.js";
import{privateChat,getChatConversation,getConversations} from "../controllers/vendorChatController.js"
const serviceRoute = express.Router();
 
serviceRoute.post("/signUp", signUp);
serviceRoute.post("/verifyOtp", verifyOtp);
serviceRoute.post("/login", login);
serviceRoute.post("/resendOtp", resendOtp);  

serviceRoute.get("/vendorInfo",verification.verifyVendor,vendorData);
serviceRoute.put("/updateProfile/:id",verification.verifyVendor,updateProfile);

serviceRoute.get("/category",verification.verifyVendor,categoryData);
serviceRoute.get("/subCategory",verification.verifyVendor,subCategoryData);
serviceRoute.get("/vehicles",verification.verifyVendor,vehicleData);

serviceRoute.post("/addService",verification.verifyVendor,addService);
serviceRoute.get("/getServices",verification.verifyVendor, fetchService);

serviceRoute.post("/addSlots",verification.verifyVendor,addSlots)

serviceRoute.get("/getOrders",verification.verifyVendor,getOrders)
serviceRoute.put("/updateOrder/:orderId/status",verification.verifyVendor,updateOrder)

serviceRoute.post('/chat-sendmessage/:vendorId/:userId',privateChat);
serviceRoute.get('/chat-conversation/:vendorId/:userId',getChatConversation);
serviceRoute.get('/chat-conversations/:vendorId',getConversations);

 
export default serviceRoute;
