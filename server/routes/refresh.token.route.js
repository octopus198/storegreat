import express from 'express';
import { refreshTokenValidator } from '../middleware/refresh.token.js';
import { refreshTokenController } from '../controller/refresh.token.js';

const refreshRoute = express.Router();

// validate refresh token first to see if it expires or not, and if okay, issue new refresh token
refreshRoute.post("/refresh-token", refreshTokenValidator, refreshTokenController);

export default refreshRoute;