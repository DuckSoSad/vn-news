import prisma from '../../config/prisma.js';
import type { User } from '../../generated/prisma/client.js';
import type { RegisterDTO } from '../../types/auth.dto.js';

class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  async findByUsername(username: string) {
    const user = await prisma.user.findUnique({
      where: { username: username },
      select: {
        username: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    return user;
  }

  async create(dto: RegisterDTO): Promise<User> {
    return await prisma.user.create({ data: dto });
  }

  async updateRefreshToken(userId: string, token: string | null) {
    return await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: token },
    });
  }

  async incrementTokenVersion(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });
  }
}

export default new AuthRepository();
