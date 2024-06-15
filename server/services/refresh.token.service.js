import RefreshTokenModel from "../models/refresh.token.model.js";

class RefreshTokenService {
  async getRefreshToken(refresh_token) {
    const storedToken = await RefreshTokenModel.findOne({
      token: refresh_token,
    });
    return storedToken;
  }
}

const refreshTokenService = new RefreshTokenService();
export default refreshTokenService;
