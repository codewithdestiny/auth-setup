import moment from "moment";
import httpStatusCodes from "../config/httpStatusCodes.js";

export default async (modelName, credentials, res) => {

    const _id = credentials.id;

    const token = credentials.token;

    const password = credentials.password;

    const response = await modelName.findById({_id}).exec();

    if(!response)   return res.status(httpStatusCodes.NOT_FOUND).json({error: true, description: "Invalid User"});

    if(response.resetPasswordToken == null) return res.status(httpStatusCodes.FORBIDDEN).json({error: true, description: "Password reset already changed"});

    if(response.resetPasswordToken != token)    return res.status(httpStatusCodes.BAD_REQUEST).json({error: true, description: "Invalid Token request"});

    if(response.passwordResetExpires < moment().toDate())   return res.status(httpStatusCodes.BAD_REQUEST).json({error: true, description: "Invalid URL"});

    response.encryptPwd(password);

    response.resetPasswordToken = null;
    response.passwordResetExpires = null;
    await response.save();

    return res.json({success: true, description: "Password reset was successful "})


}