import httpStatusCodes from "../../config/httpStatusCodes.js";
import AuthModel from "../../models/AuthModel.js";
import resetPasswordService from "../../services/resetPassword.service.js";
import asyncHandler from "../middlewares/asyncHander.js";

export default asyncHandler(async(req, res, next) => {

    const {token, id} = req.query;

    const {password} = req.body;

    const result = await resetPasswordService(AuthModel, {token, id, password}, res);

})