import httpStatusCodes from "../config/httpStatusCodes.js";

export default async (modelName, credentials, res) => {

    const _id = credentials.id;

    const firstName  = credentials?.firstName ? credentials.firstName : null;

    const lastName = credentials?.lastName ? credentials.lastName : null;

    const middleName = credentials?.middleName ? credentials?.middleName : null;

    const phoneNo = credentials?.phoneNo ? credentials.phoneNo : null;

    const gender = credentials?.gender ? credentials.gender : null;

    const residentialAddress = credentials?.residentialAddress ? credentials.residentialAddress : null;

    const response = await modelName.findByIdAndUpdate({_id}, {firstName, lastName, phoneNo, middleName, residentialAddress, gender});

    return res.status(httpStatusCodes.ACCEPTED).json({success: true, description: "Profile update was successful"})

}