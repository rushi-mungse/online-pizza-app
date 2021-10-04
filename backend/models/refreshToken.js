
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const refreshSchema = new Schema({
    refresh_token: { type: String, unique:true },

}, { timestamps: false });

export default mongoose.model('RefreshToken', refreshSchema, 'refreshTokens');