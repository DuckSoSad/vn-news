import { useNavigate } from 'react-router';
import { useAuthStore } from '~/store/useAuthStore';
import { usePopupStore } from '~/store/usePopupStore';
import type { User } from '~/types/user.type';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface ProfileCardProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ProfileCard = ({ open, setOpen }: ProfileCardProps) => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user) as User | null;
  const setLogoutOpen = usePopupStore((state) => state.setLogoutOpen);

  if (!user) return null;

  return (
    <div className="hidden md:block w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-auto w-full justify-start items-center p-3 gap-3 rounded-full cursor-pointer hover:bg-accent transition-colors"
          >
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shrink-0 border border-border select-none overflow-hidden">
              <span className="text-xl">🦆</span>
            </div>

            <div className="flex flex-col text-left min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">
                {user.name}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                @{user.username}
              </span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-61 p-1.5 rounded-2xl shadow-xl border border-border bg-popover"
          side="top"
          align="center"
          sideOffset={12}
        >
          <div className="flex flex-col gap-0.5">
            <Button
              variant="ghost"
              onClick={() => {
                navigate('/profile');
                setOpen(false);
              }}
              className="w-full h-10 justify-start bg-transparent hover:text-foreground text-sm font-medium rounded-xl cursor-pointer"
            >
              Thông tin tài khoản
            </Button>
            <Button
              variant="ghost"
              className="w-full h-10 justify-start bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10 text-sm font-semibold rounded-xl cursor-pointer"
              onClick={() => {
                setOpen(false);
                setLogoutOpen(true);
              }}
            >
              Đăng xuất @{user.username}
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProfileCard;
