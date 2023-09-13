import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../../models/userSchema.js";
dotenv.config();

const verifyUser = async (req, res, next) => {
  const tokenData = req.header("Authorization");

  if (!tokenData) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tokenJson = JSON.parse(tokenData.split(" ")[1]);
    const token = tokenJson.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
 
    if (decoded) {
      const userId = decoded.id;
      const user = await UserModel.findById({ _id: userId });
      if (user.isBlock) {
        return res.status(403).json({ message: "User is blocked" });
      }
      next();
    }
  } catch (error) {
    console.log("error in auth", error);
  }
};

export default { verifyUser };
