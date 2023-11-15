import httpStatusCodes from "../config/httpStatusCodes.js";

export default async (modelName, credentials, res) => {
    const user = await modelName.findOne({email: credentials.email}).select("password").exec();
    if(!user)   return res.status(httpStatusCodes.NOT_FOUND).json({error: true, description: "Account Doesn't Exist, Create One!"});
    if(!user.comparePwd(credentials.password))  return res.status(httpStatusCodes.BAD_REQUEST).json({error: true, description: "Invalid User Credentials"});
    const {accessToken, refreshToken} = await user.signJwt();
    await modelName.findOneAndUpdate({_id : user._id}, {refreshToken})
    user.setCookie(res);
    return res.status(httpStatusCodes.OK).json({success: true,  accessToken, refreshToken})

}