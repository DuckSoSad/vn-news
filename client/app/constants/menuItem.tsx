import { Bell, Home, Search, User } from 'lucide-react';

export const menuItems = [
  {
    title: 'Trang chủ',
    to: '/home',
    icon: Home,
  },
  {
    title: 'Khám phá',
    to: '/explore',
    icon: Search,
  },
  // {
  //   title: 'Thông báo',
  //   to: '/notifications',
  //   icon: Bell,
  // },
  {
    title: 'Hồ sơ',
    to: '/profile',
    icon: User,
  },
];
