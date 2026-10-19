import { HandleError } from '../../errors/handle-error.js';
import authRepository from '../../repository/client/auth.repository.js';
import type { LoginDTO, RegisterDTO } from '../../types/auth.dto.js';
import {
  checkPassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyRefreshToken,
} from '../../utils/auth.js';

class AuthService {
  async register(dto: RegisterDTO) {
    const userExists = await authRepository.findByEmail(dto.email);
    if (userExists) {
      throw new HandleError(409, 'Địa chỉ email này đã được sử dụng.');
    }

    const usernameExists = await authRepository.findByUsername(dto.username);
    if (usernameExists) {
      throw new HandleError(409, 'Danh xưng này đã được sử dụng.');
    }

    const hashedPassword = await hashPassword(dto.password);

    const newUser = await authRepository.create({
      email: dto.email,
      name: dto.name,
      username: dto.username,
      password: hashedPassword,
    });

    return { userId: newUser.id };
  }

  async login(dto: LoginDTO) {
    const user = await authRepository.findByEmail(dto.email);
    if (!user) {
      throw new HandleError(
        401,
        'Sai tài khoản hoặc mật khẩu. Vui lòng đăng nhập lại.',
      );
    }

    const isPasswordMatch = await checkPassword(dto.password, user.password);
    if (!isPasswordMatch) {
      throw new HandleError(
        401,
        'Sai tài khoản hoặc mật khẩu. Vui lòng đăng nhập lại.',
      );
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await authRepository.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
  }

  async renewAccessToken(oldRefreshToken: string) {
    const decoded = verifyRefreshToken(oldRefreshToken);
    if (!decoded)
      throw new HandleError(401, 'The token is invalid or has expired.');

    const user = await authRepository.findById(decoded.userId);
    if (!user || user.refreshToken !== oldRefreshToken) {
      if (user) await authRepository.updateRefreshToken(user.id, null);
      throw new HandleError(
        401,
        'Warning: Access denied due to token mismatch!',
      );
    }

    const newAccessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });
    const newRefreshToken = generateRefreshToken({ userId: user.id });

    await authRepository.updateRefreshToken(user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new HandleError(401, 'Invalid token.');
    }
    const userId = decoded.userId;

    await authRepository.updateRefreshToken(userId, null);
    await authRepository.incrementTokenVersion(userId);
  }

  async checkAccountExist(username: string) {
    const user = await authRepository.findByUsername(username);
    if (!user) {
      throw new HandleError(404, 'This account does not exist.');
    }
    return user;
  }
}

export default new AuthService();
