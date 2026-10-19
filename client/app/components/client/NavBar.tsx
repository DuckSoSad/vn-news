import { LogIn, SquarePen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import ProfileCard from '~/components/ProfileCard';
import { Button } from '~/components/ui/button';
import { menuItems } from '~/constants/menuItem';
import { useAuthStore } from '~/store/useAuthStore';

const NavBar = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="hidden md:flex w-20 md:w-64 h-screen sticky top-0 flex-col justify-between items-center py-4 px-2 border-r border-border select-none">
      <div className="flex flex-col justify-between gap-3 h-full w-full">
        <div className="flex flex-col justify-between items-center md:items-start gap-4 w-full">
          <div className="flex items-center justify-center w-14 h-14 text-2xl font-black rounded-full hover:bg-accent animation duration-200 ease-in-out cursor-pointer text-foreground select-none">
            𝕍ℕ
          </div>

          <nav className="flex flex-col items-center md:items-start gap-1 w-full font-medium">
            {menuItems.map((item) => {
              const IconComponent = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => `
                  flex items-center gap-4 p-3 hover:bg-muted rounded-full w-fit md:w-full transition-colors duration-200
                  ${isActive ? 'font-bold text-foreground' : 'text-muted-foreground'}
                `}
                >
                  <IconComponent className="w-6 h-6" />
                  <span className="hidden md:inline text-lg">{item.title}</span>
                </NavLink>
              );
            })}
          </nav>

          <Button
            variant={'default'}
            className="w-12 h-12 md:w-[90%] md:h-11 rounded-full md:rounded-xl text-base font-semibold cursor-pointer shadow-md transition-all active:scale-95"
          >
            <span className="hidden md:inline">Đăng</span>

            <SquarePen className="w-6 h-6 md:hidden shrink-0" />
          </Button>
        </div>

        {isAuthenticated ? (
          <ProfileCard open={open} setOpen={setOpen} />
        ) : (
          <Button
            variant={'default'}
            className="w-14 h-14 md:w-[90%] gap-2 rounded-full md:rounded-xl text-base font-semibold cursor-pointer shadow-md transition-all active:scale-95"
            asChild
          >
            <Link to={'/login'}>
              <LogIn className="size-6 shrink-0" />
              <span className="hidden md:inline">Đăng nhập</span>
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
};

export default NavBar;
