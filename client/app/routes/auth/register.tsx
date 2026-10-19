import { redirect } from 'react-router';
import { RegisterPage } from '~/pages/auth/RegisterPage';
import { useAuthStore } from '~/store/useAuthStore';
import type { Route } from './+types/register';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Đăng ký / VN News' },
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

export default function Register() {
  return <RegisterPage />;
}
