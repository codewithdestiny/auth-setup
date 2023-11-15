import httpStatusCodes from "../../config/httpStatusCodes.js";
import AuthModel from "../../models/AuthModel.js";
import getMeService from "../../services/getMe.service.js";
import asyncHandler from "../middlewares/asyncHander.js";

export default asyncHandler( async(req, res) => {

    const authUser = res.locals?.user;
    const _id = authUser?.id;

    const response = await getMeService(AuthModel, _id );

    return res.status(httpStatusCodes.OK).json({success: true, response});

})