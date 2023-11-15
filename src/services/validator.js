import httpStatusCodes from "../config/httpStatusCodes.js";
import regExp from "../config/regExp.js";

export default (input, res) => {
    const data = {...input};

    const response = Object.entries(data).map( ([key, value]) => {
        if(key == "email" && !regExp.EMAIL_REGEX.test(value)) return  res.status(httpStatusCodes.BAD_REQUEST).json({error: true, description: "Invalid email address"})

        if(key == "password" && !regExp.PWD_REGEX.test(value))   return  res.status(httpStatusCodes.BAD_REQUEST).json({error: true, description: "Invalid password format. Hint: Atleast capital, small, number, & symbols"})
    });

    return response;

}