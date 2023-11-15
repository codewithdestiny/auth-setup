import AuthModel from "../../models/AuthModel.js";
import asyncHandler from "../middlewares/asyncHander.js";
import { config } from "dotenv";
import resetPasswordRequestService from "../../services/resetPasswordRequest.service.js";
import httpStatusCodes from "../../config/httpStatusCodes.js";
config();

export default asyncHandler(async(req, res, next) => {
    const {email} = req.body;
    resetPasswordRequestService(AuthModel, email);
    return res.status(httpStatusCodes.ACCEPTED).json({
        success: true,
        message: "Use the link sent to your email to reset your password"
    })
    
})