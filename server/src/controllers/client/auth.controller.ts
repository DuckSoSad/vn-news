import type { RequestHandler } from 'express';
import { HandleError } from '../../errors/handle-error.js';
import authService from '../../services/client/auth.service.js';
import { catchAsync } from '../../utils/catch-async.js';

class AuthController {
  register: RequestHandler = catchAsync(async (req, res) => {
    const result = await authService.register(req.body);
    res.status(201).json({
      status: 'success',
      data: result,
    });
  });

  login: RequestHandler = catchAsync(async (req, res) => {
    const result = await authService.login(req.body);

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const { accessToken, user } = result;

    res.status(200).json({
      status: 'success',
      data: {
        accessToken,
        user,
      },
    });
  });

  refresh: RequestHandler = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new HandleError(401, 'Missing refresh token!!!');
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.renewAccessToken(refreshToken);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: 'success',
      data: { accessToken },
    });
  });

  logout: RequestHandler = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new HandleError(401, 'Missing refresh token!!!');
    }

    await authService.logout(refreshToken);

    res.clearCookie('refreshToken');
    res
      .status(200)
      .json({ status: 'success', message: 'Logged out successfully.' });
  });

  checkAccount: RequestHandler = catchAsync(async (req, res) => {
    const { username } = req.body;
    const user = await authService.checkAccountExist(username);

    res.status(200).json({
      status: 'success',
      data: user,
    });
  });
}

export default new AuthController();
