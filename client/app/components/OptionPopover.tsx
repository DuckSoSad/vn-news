import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAuthStore } from '~/store/useAuthStore';
import { Button } from './ui/button';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

interface OptionPopoverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  for?: 'post' | 'comment';
  selectFunc?: () => void;
  deleteFunc?: () => Promise<void>;
  author: string;
  className?: string;
}

const OptionPopover = ({
  open,
  setOpen,
  for: forProp,
  selectFunc,
  deleteFunc,
  author,
  className,
}: OptionPopoverProps) => {
  const [openDelete, setOpenDelete] = useState(false);
  const user = useAuthStore((state) => state.user);

  if (user?.username !== author) {
    return null;
  }

  return (
    <div className={twMerge('absolute -top-0.5 right-0 px-0', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={'ghost'}
            size={'lg'}
            className="hover:bg-transparent! hover:text-accent-foreground text-muted-foreground transition-all duration-200 group rounded-full cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="transition-transform group-hover:scale-110">
              <Ellipsis className="w-6 h-6 group-hover:stroke-accent-foreground transition-all" />
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="w-36 p-1.5 mr-2 md:mr-0 rounded-2xl shadow-xl border border-border bg-popover"
          side="top"
          align="center"
          sideOffset={12}
        >
          <div className="flex flex-col gap-0.5">
            <Button
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                if (selectFunc) {
                  selectFunc();
                }
                setOpen(false);
              }}
              className="w-full h-10 justify-start bg-transparent hover:text-foreground text-sm font-medium rounded-xl cursor-pointer"
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="ghost"
              className="w-full h-10 justify-start bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10 text-sm font-semibold rounded-xl cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDelete(true);
                setOpen(false);
              }}
            >
              Xóa
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {openDelete && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpenDelete(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100/20 backdrop-blur-sm overflow-y-auto overscroll-contain"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-black text-white rounded-lg p-6 w-80 text-center shadow-lg border border-border max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-lg font-semibold mb-2">Xác nhận xóa?</h2>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa{' '}
              {forProp === 'post' ? 'bài viết' : 'bình luận'} này không? Điều
              này không thể hoàn tác và nội dung này sẽ bị xóa khỏi hồ sơ của
              bạn, dòng thời gian của bất kỳ tài khoản nào theo dõi bạn và kết
              quả tìm kiếm.
            </p>
            <div className="flex flex-col gap-2">
              <Button
                className="h-12 rounded-full bg-red-500 text-destructive-foreground hover:bg-red-500/90 cursor-pointer"
                onClick={async () => {
                  if (deleteFunc) {
                    await deleteFunc();
                  }
                  setOpenDelete(false);
                }}
              >
                Xóa
              </Button>
              <Button
                variant="outline"
                className="h-12 rounded-full border-2 border-border text-black dark:text-accent-foreground hover:bg-destructive/10 cursor-pointer"
                onClick={() => setOpenDelete(false)}
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionPopover;
