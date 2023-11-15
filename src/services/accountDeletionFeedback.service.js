export default async (modelName, credentials) => {
    const response = await modelName.create({credentials});
}