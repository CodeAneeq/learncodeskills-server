import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/user.schema.js";
import Constants from "../constant.js";
import sendMail from "../utilities/email.send.js";

const signup = async (req, res) => {
    try {
        if (!req.file) {
         return res.status(400).json({status: "failed", message: "Image is required"});   
        }
        let { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {            
            return res.status(400).json({status: "Failed", message: "All fields are required"});
        }       
        let duplicateEmail = await userModel.findOne({email});
        if (duplicateEmail) {
            return res.status(400).json({status: "Failed", message: "Email already in use"});
        }
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt);
        let user = new userModel({
            name,
            email, 
            password: hashPassword,
            role,
            profileImg: req.file.path
        })
        await user.save();
        let payload = {
            newUser: {
                id: user._id
            }
        }
        let token = jwt.sign(payload, Constants.SECRET_KEY, { expiresIn: "1y" });
        user.token = token;
        await user.save();
        res.status(201).json({status: "Success", message: "User sign up successfully", data: user});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});
    }
}

const login = async (req, res) => {
    try {
        let {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({status: "Failed", message: "All fields are required"});
        }
        let loginUser = await userModel.findOne({email});
        if (!loginUser) {
            return res.status(400).json({status: "Failed", message: "Email not found"});
        }
        let payload = {
            newUser: {
                id: loginUser._id
            }
        }
        let isMatch = await bcrypt.compare(password, loginUser.password);
        if (!isMatch) {
            return res.status(400).json({status: "Failed", message: "Password is wrong"});
        }
        let token = jwt.sign(payload, Constants.SECRET_KEY, {expiresIn : '1y'});
        loginUser.token = token;
        await loginUser.save();
        res.status(200).json({status: "success", message: "User login successfully", data: loginUser})
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});
    }
}

const forgotPassword = async (req, res) => {
    try {
        let {email} = req.body;
        if (!email) {
            return res.status(400).json({status: "Failed", message: "Email is required"});
        }
        let user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({status: "Failed", message: "user not found"});
        }
        const OTP = Math.floor(Math.random() * 900000 + 100000);

        const mailResponse = await sendMail({
            email: [email],
            subject: "For Verification OTP",
            html: `<h1>Please verify OTP and teh OTP is ${OTP}</h1>`
        })

        if (!mailResponse) {
            return res.status(500).json({ status: "Failed", message: "Please try agaain letter" });
        }
        let date = new Date(Date.now() + 10 * 60 * 1000); 

        user.otp.value = OTP;
        user.otp.expireAt = date;
        user.otp.validation = false;
        await user.save()
        res.status(200).json({status: "success", message: "Otp send successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});
    }
}

const verifyOTP = async (req, res) => {
    try {
        let {email, otp} = req.body;
        if (!email || !otp) {
            return res.status(400).json({status: "Failed", message: "All fields are required"});
        }
        let user = await userModel.findOne({email});
        if (!user) {
            return res.status(400).json({status: "Failed", message: "user not found"});
        }
        if (user.otp.value !== otp) {
            return res.status(400).json({status: "Failed", message: "otp is wrong or expired"});
        }
        user.otp.validation = true;
        await user.save();
        res.status(200).json({status: "Success", message: "Otp verified successfully", data: user});
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});
    }
}

const resetPassword = async (req, res) => {
    try {
        let {email, password} = req.body;
        if (!email || !password) {
           return res.status(400).json({status: "failed", message: "all fields are required"});
        }
        let user = await userModel.findOne({email});
        if (!user) {
           return res.status(400).json({status: "failed", message: "user not found"});
        }
        if (user.otp.validation === false) {
            return res.status(400).json({status: "failed", message: "You are not validated to change password"});
        }
        let salt = await bcrypt.genSalt(10);
        let hashPassword = await bcrypt.hash(password, salt)
        user.password = hashPassword;
        user.otp.validation = false;
        await user.save();
          let payload = {
            newUser: {
                id: user._id
            }
        }
        let token = jwt.sign(payload, Constants.SECRET_KEY, { expiresIn: "1y" });
        user.token = token;
        await user.save();
        res.status(200).json({status: "success", message: "password change successfully", data: user});
    } catch (error) {
         console.log(error);
        res.status(500).json({status: "Failed", message: "Internal Server Error"});
    }
}

const getUsers = async (req, res) => {
    try {
        let users = await userModel.find();
        res.status(200).json({status: "success", message: "User Fetch Successfully", data: users})
    } catch (error) {
        console.log(error);
        res.status(500).json({status: "failed", message: "Internal Server Error"})        
    }
}

export {signup, login, forgotPassword, verifyOTP, resetPassword, getUsers}