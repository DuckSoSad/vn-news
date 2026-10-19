import type { UserModel } from '../../generated/prisma/models.js';
import userRepository from '../../repository/server/user.repository.js';

class UserService {
  async getAll(): Promise<
    Omit<UserModel, 'password' | 'refreshToken' | 'tokenVersion'>[]
  > {
    return await userRepository.findAll();
  }
}

export default new UserService();
