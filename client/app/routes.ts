import {
  index,
  layout,
  type RouteConfig,
  route,
} from '@react-router/dev/routes';

export default [
  route('login', 'routes/auth/login.tsx'),
  route('register', 'routes/auth/register.tsx'),

  layout('layouts/ClientLayout.tsx', [
    index('routes/client/redirect.tsx'),
    route('home', 'routes/client/home.tsx'),
    route('detail/:id', 'routes/client/detail.tsx'),
    route(':username', 'routes/client/profile.tsx'),
    route('explore', 'routes/client/explore.tsx'),
  ]),
] satisfies RouteConfig;
