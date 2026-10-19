import { api } from '~/lib/api';
import { ENDPOINTS } from '~/lib/endpoints';
import type { ExtendedUser } from '~/types/user.type';

export const AuthService = {
  checkAccount: async ({
    username,
  }: {
    username: string;
  }): Promise<ExtendedUser> => {
    const res = await api.post(ENDPOINTS.checkAccount, { username });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await api.post(ENDPOINTS.logout);
  },
};
