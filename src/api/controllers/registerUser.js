import asyncHandler from '../middlewares/asyncHander.js';
import AuthModel from '../../models/AuthModel.js';
import httpStatusCodes from '../../config/httpStatusCodes.js';
import createAccountService from '../../services/createAccount.service.js';

export default asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;
    const user = await createAccountService(AuthModel, {email, password})
    return res.status(httpStatusCodes.CREATED).json({
        success: true,
        user: user,
        message: "New Account created!"
    })
})