import bcrypt from 'bcryptjs';

export default async (modelName, data) => {

    const salt = bcrypt.genSaltSync();
    const password = bcrypt.hashSync(data.password, salt);
    return await modelName.create({...data, password});
}