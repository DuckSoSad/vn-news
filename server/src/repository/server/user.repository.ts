import prisma from '../../config/prisma.js';
import type {
  UserCreateInput,
  UserModel,
  UserUpdateInput,
} from '../../generated/prisma/models.js';

class UserRepository {
  async findAll(): Promise<
    Omit<UserModel, 'password' | 'refreshToken' | 'tokenVersion'>[]
  > {
    return await prisma.user.findMany({
      omit: {
        password: true,
        refreshToken: true,
        tokenVersion: true,
      },
    });
  }

  async findById(id: string): Promise<UserModel | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: UserCreateInput): Promise<UserModel> {
    return await prisma.user.create({ data });
  }

  async update(id: string, data: UserUpdateInput): Promise<UserModel> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

export default new UserRepository();
