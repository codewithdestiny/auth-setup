export default async(modelName, _id) => {
    return await modelName.findById({_id}).select("-refreshToken");
}