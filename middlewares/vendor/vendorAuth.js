import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyVendor = (req, res, next) => {
  const tokenData = req.header("Authorization");

  console.log("in verify", tokenData);

  if (!tokenData) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tokenJson = JSON.parse(tokenData.split(" ")[1]);
    const token = tokenJson.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  

    if (decoded) {
      const vendorId = decoded.id;
      req.vendorId = vendorId;
      next();
    }
  } catch (error) {
    console.log("error in auth", error);
  }
};

export default { verifyVendor };
