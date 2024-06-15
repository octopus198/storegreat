import mongoose from "mongoose";
import Collections from "../constants/collection.js";

const refreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    token: {type: String},
    expireAt: {type: Date}
})

const RefreshTokenModel = mongoose.model(Collections.REFRESH_TOKEN, refreshTokenSchema);

export default RefreshTokenModel;