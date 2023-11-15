import mongoose, { Schema } from "mongoose";
import AccountDeletionModel from '../models/AccountDeletionModel.js';
const AccountDeletionSchema = new Schema({
    email : String,
    feedback : String,
}, {
    collection: "AccountDeletionSchema",
    timestamps: true
})

export default mongoose.model.AccountDeletionSchema ||  mongoose.model("AccountDeletionSchema", AccountDeletionSchema);