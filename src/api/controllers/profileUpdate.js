import AuthModel from "../../models/AuthModel.js";
import profileUpdateService from "../../services/profileUpdate.service.js";
import asyncHandler from "../middlewares/asyncHander.js";

export default  asyncHandler( async (req, res, next) => {

    const authUser = res.locals.user;

    const id = authUser?.id;

    const credentials = {id, ...req.body }

    profileUpdateService(AuthModel, credentials, res);

})