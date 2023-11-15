import { config } from "dotenv";
import sendEmail from "../config/EmailEngine.js";
import httpStatusCodes from "../config/httpStatusCodes.js";
import AccountDeletionModel from '../models/AccountDeletionModel.js';
import accountDeletionFeedback from '../services/accountDeletionFeedback.service.js';
config();

export default async (modelName, credentials, res) => {

    const _id = credentials?.id;
    const feedback = credentials?.feedback;

    const response = await modelName.findByIdAndDelete({_id});

    const feedbackInit = await AccountDeletionModel.create({email: response?.email, feedback});

    if(feedbackInit)    return res.status(httpStatusCodes.NOT_FOUND).json({success: true, message: `Goodbye ${response?.firstName == undefined ? '' : response?.firstName}! Thanks for your feedback`})
    
    return res.status(httpStatusCodes.NOT_FOUND).json({success: true, message: `Goodbye ${response?.firstName == undefined ? '' : response?.firstName}!`});
}