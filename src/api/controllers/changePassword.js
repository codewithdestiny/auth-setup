import AuthModel from "../../models/AuthModel.js";
import changePasswordService from "../../services/changePassword.service.js";
import asyncHandler from "../middlewares/asyncHander.js";

export default asyncHandler( async (req, res, next) => {

    const {password, currentPassword} = req.body;

    const authUser = res.locals.user;

    const id = authUser.id;

    changePasswordService(AuthModel, {id, password, currentPassword}, res);

});

