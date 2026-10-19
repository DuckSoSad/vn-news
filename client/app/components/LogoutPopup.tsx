import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { AuthService } from '~/services/auth/auth.service';
import { useAuthStore } from '~/store/useAuthStore';
import { getErrorMessage } from '~/utils/getErrorMessage';
import { Button } from './ui/button';

interface LogoutPopupProps {
  onClose: () => void;
}

const LogoutPopup = ({ onClose }: LogoutPopupProps) => {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      await AuthService.logout();
    } catch (err) {
      console.error(err);
      toast.error(
        getErrorMessage(
          err,
          'Đăng xuất khỏi máy chủ thất bại, nhưng bạn đã được đăng xuất khỏi thiết bị này.',
        ),
      );
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-blue-100/20 overflow-y-auto overscroll-contain"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-black text-white rounded-lg p-6 w-80 text-center shadow-lg border border-border max-h-[80vh] overflow-y-auto"
      >
        <h2 className="text-lg font-semibold mb-2">Đăng xuất khỏi VN News?</h2>
        <p className="mb-6">
          Bạn luôn có thể đăng nhập trở lại bất kỳ lúc nào. Nếu bạn chỉ muốn
          chuyển đổi tài khoản, bạn có thể thực hiện bằng cách thêm một tài
          khoản hiện có.
        </p>
        <div className="flex flex-col gap-2">
          <Button
            className="h-12 rounded-full bg-red-500 text-destructive-foreground hover:bg-red-500/90 cursor-pointer"
            onClick={() => {
              handleLogout();
              onClose();
            }}
          >
            Đăng xuất
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-full border-2 border-border text-black dark:text-accent-foreground hover:bg-destructive/10 cursor-pointer"
            onClick={onClose}
          >
            Hủy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
