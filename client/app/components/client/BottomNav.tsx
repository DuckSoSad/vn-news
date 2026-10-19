import { NavLink } from 'react-router';
import { menuItems } from '~/constants/menuItem';

export const BottomNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-background/60 backdrop-blur-md border-t border-border z-50 px-4 select-none">
      <nav className="flex items-center justify-around h-full w-full max-w-md mx-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex flex-col justify-center items-center gap-1 p-2 rounded-full transition-colors active:scale-95 active:bg-accent
                ${isActive ? 'text-foreground font-bold' : 'text-muted-foreground'}
              `}
            >
              <IconComponent className="w-6 h-6" />
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};
