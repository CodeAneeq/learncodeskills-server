import Constants from "../constant.js";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.schema.js";


let authMiddleware = async (req, res, next) => {
try {
    const authHeader = req.headers.authorization;
     if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ status: "failed", message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]
 const decoded = jwt.verify(token, Constants.SECRET_KEY);
 const user = await userModel.findById(decoded.newUser.id);
if (!user) {
      return res
        .status(404)
        .json({ status: "failed", message: "User not found" });
    }

    // 5. Attach user to request
    req.user = user;
    next();
} catch (error) {
     console.error("Auth Middleware Error:", error.message);
    return res
      .status(401)
      .json({ status: "failed", message: "Invalid or expired token" });
}
}

let checkInstructor = async (req, res, next) => {
        let user = req.user;
        if (user.role !== 'instructor') {
            return res.status(404).json({status: "failed", message: "Only instructor can access"});
        }
        next()
}

export {authMiddleware, checkInstructor}