import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const verifyAdmin = (req, res, next) => {
  const tokenData = req.header("Authorization");
  console.log("tokendata in mid", tokenData);
  if (!tokenData) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const token = tokenData.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded) {
      next();
    }   
  } catch (error) {
    console.log("error in auth", error);
  }
};

export default { verifyAdmin };
