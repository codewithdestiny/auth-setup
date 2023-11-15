import { config } from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';
import httpStatusCodes from '../../config/httpStatusCodes.js'
import asyncHandler from './asyncHander.js';
config();

const verifyJWT = asyncHandler(async (req, res, next) => {
    
    const authorizationHeader = req.headers.authorization;

    if(!authorizationHeader || authorizationHeader.split(' ')[0] != "Bearer" )  return res.sendStatus(httpStatusCodes.UNAUTHORIZED)

    const authorizationToken = authorizationHeader.split(' ')[1]  // Bearer 2f893d8642300fb71ddb77d67d388e226a0d8d987dde3f8f37689b3cb3b72f5e

    jsonwebtoken.verify(authorizationToken, `${process.env.ACCESS_TOKEN_SECRET}`, (err, decoded) => {
        if(err)  return res.sendStatus(httpStatusCodes.UNAUTHORIZED)
        res.locals.user = decoded;
        next();
    })

});

export default verifyJWT;