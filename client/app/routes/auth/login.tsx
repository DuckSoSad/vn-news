import { redirect } from 'react-router';
import { LoginPage } from '~/pages/auth/LoginPage';
import { useAuthStore } from '~/store/useAuthStore';
import type { Route } from './+types/login';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Đăng nhập / VN News' },
    { name: 'description', content: 'Chào mừng đến với bình nguyên vô tận!' },
  ];
}

export function clientLoader() {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;
  if (isAuthenticated) {
    return redirect('/home');
  }

  return null;
}

export default function Login() {
  return <LoginPage />;
}
