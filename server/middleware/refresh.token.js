import refreshTokenService from "../services/refresh.token.service.js";

// check if refresh token is invalid (expire)
export const refreshTokenValidator = async (req, res, next) => {
  const { refresh_token } = req.body;

  try {
    const storedToken = await refreshTokenService.getRefreshToken(refresh_token)

    if (!storedToken || storedToken.expireAt < new Date()) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }
    next();
  } catch (error) {
    console.log("Error validating refresh token:", error);
    res.status(500).json({ message: "Internal server error - Refresh token validator" });
  }
};
