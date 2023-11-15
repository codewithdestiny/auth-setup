export default async (modelName, email) => {
    const user = await modelName.findOne({email}).exec();
    if(!user)   return res.status(httpStatusCodes.NOT_FOUND).json({error: true, description: "No account Found!"});
    user.initPasswordReset();
    const response = await user.save();
    response.sendPasswordResetEmail();
}