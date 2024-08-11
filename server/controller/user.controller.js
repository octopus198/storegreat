import { MESSAGE } from "../constants/message.js";
import userService from "../services/user.service.js";

export const registerController = async (req, res, next) => {
  const { email, password, username } = req.body;
  await userService.register(email, password, username);
  return res.json({
    message: MESSAGE.REGISTER_SUCCESS,
  });
};

export const getUserController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userService.getUser(email);
    if (!user) {
      return res.status(404).json({
        message: MESSAGE.USER_DOES_NOT_EXIST,
      });
    }

    return res.json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const getMeController = async (req, res, next) => {
  try {
    const userID = req.user.id;
    const user = await userService.getMe(userID);

    return res.json(user);
  } catch (err) {
    throw new Error("Err getting user", err);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { access_token, refresh_token, expireAt } = await userService.login(
      userId
    );
    res.setHeader("Authorization", `Bearer ${access_token}`);
    res.setHeader("X-Refresh-Token", refresh_token);
    return res.json({
      message: MESSAGE.LOGIN_SUCCESS,
      tokens: {
        access_token,
        refresh_token,
        expireAt,
      }
    });
  } catch (err) {
    next(err);
  }
};
