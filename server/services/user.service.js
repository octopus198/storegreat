import bcrypt from "bcrypt";
import UserModel from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";
import { generateRefreshToken } from "../utils/refresh.token.js";
import RefreshTokenModel from "../models/refresh.token.model.js";

class UserService {
  async register(email, password, username) {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);
    const registrationDate = new Date();
    await UserModel.create({
      email,
      password: hashPassword,
      username,
      registrationDate
    });
  }

  async getUser(email) {
    const user = await UserModel.findOne({email});
    return user;
  }

  async getMe(userID) {
    try {
      const user = await UserModel.findOne({ _id: userID });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to get user information.');
    }
  }

  async login(userId) {
    const access_token = await signToken({
        payload: {
            id: userId
        },
        privateKey: process.env.JWT_PRIVATE_KEY
    })
    const refresh_token = generateRefreshToken();
    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7);
    await RefreshTokenModel.create({userId, token: refresh_token, expireAt});
    return {access_token, refresh_token, expireAt}
  }
}

const userService = new UserService();
export default userService;