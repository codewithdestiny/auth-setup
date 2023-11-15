import AuthModel from "../../models/AuthModel.js";
import asyncHandler from "../middlewares/asyncHander.js";
import validator from '../../services/validator.js';
import httpStatusCodes from "../../config/httpStatusCodes.js";
import loginUserService from "../../services/loginUser.service.js";

export default asyncHandler( async (req, res, next) => {
    const {email, password} = req.body;
    loginUserService(AuthModel, {email, password}, res);
})