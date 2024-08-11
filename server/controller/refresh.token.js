import UserModel from "../models/user.model.js";
import { generateRefreshToken } from "../utils/refresh.token.js";
import { signToken } from "../utils/jwt.js";
import { MESSAGE } from "../constants/message.js";
import refreshTokenService from "../services/refresh.token.service.js";

export const refreshTokenController = async (req, res) => {
  const { refresh_token } = req.body;
  try {
    const storedToken = await refreshTokenService.getRefreshToken(refresh_token)
    const user = await UserModel.findById(storedToken.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!storedToken) {
      throw new Error("cannot find refresh token in database")
    }
    const access_token = await signToken({
      payload: { id: user._id },
      privateKey: process.env.JWT_PRIVATE_KEY,
      options: { expiresIn: "1d" },
    });
    const new_refresh_token = generateRefreshToken();
    storedToken.token = new_refresh_token;
    storedToken.expireAt = new Date().setDate(new Date().getDate() + 7); // update the document of refresh in the database
    await storedToken.save();
    
    return res.json({
      message: MESSAGE.GET_REFRESH_SUCCESS,
      tokens: {
        access_token,
        refresh_token: new_refresh_token,
      }
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res
      .status(500)
      .json({ message: "Internal server error - refresh token controller" });
  }
};
