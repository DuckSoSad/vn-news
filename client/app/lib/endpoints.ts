export const ENDPOINTS = {
  // auth
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  refreshToken: '/auth/refresh',
  checkAccount: '/auth/check-account',

  // client
  posts: '/posts',
  postById: (id: string) => `/posts/${id}`,
  commentsByPostId: (id: string) => `/posts/${id}/comments`,

  comments: '/comments',
  commentById: (id: string) => `/comments/${id}`,

  categories: '/categories',

  tags: '/tags',
};
