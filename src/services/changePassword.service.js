import bcrypt from 'bcryptjs';
import httpStatusCodes from '../config/httpStatusCodes.js';
export default  async (modelName, credentials, res) => {

    const _id = credentials.id;

    const salt = bcrypt.genSaltSync();

    const password = bcrypt.hashSync(credentials.password, salt);

    const response = await modelName.findById({_id}).select("password").exec();

    if(!response.comparePwd(credentials.currentPassword))  return res.status(httpStatusCodes.FORBIDDEN).json({error: true, description: "Current password do not match"});

    response.password = password;

    await response.save();

    return res.status(httpStatusCodes.ACCEPTED).json({success: true, message: "Password successfully changed"})

}