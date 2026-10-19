import { Outlet } from 'react-router';
import { BottomNav } from '~/components/client/BottomNav';
import LogoutPopup from '~/components/LogoutPopup';
import { usePopupStore } from '~/store/usePopupStore';
import NavBar from '../components/client/NavBar';
import SideBar from '../components/client/SideBar';

export default function ClientLayout() {
  const logoutOpen = usePopupStore((state) => state.logoutOpen);
  const setLogoutOpen = usePopupStore((state) => state.setLogoutOpen);

  return (
    <div className="mx-auto flex justify-center min-h-screen max-w-7xl px-0 sm:px-4">
      <NavBar />

      <main className="flex-1 max-w-2xl border-x border-border min-h-screen">
        <Outlet />
      </main>

      <SideBar />

      <BottomNav />

      {logoutOpen && <LogoutPopup onClose={() => setLogoutOpen(false)} />}
    </div>
  );
}
