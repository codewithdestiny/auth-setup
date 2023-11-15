import AuthModel from "../../models/AuthModel.js";
import deleteAccountService from "../../services/deleteAccount.service.js";
import asyncHandler from "../middlewares/asyncHander.js";

export default asyncHandler(async(req, res) => {
    const {feedback} = req.body;
    
    const authUser = res.locals?.user;

    const id = authUser?.id;

    deleteAccountService(AuthModel, {feedback, id}, res);

})