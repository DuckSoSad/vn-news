import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '~/components/ui/field';
import { Input } from '~/components/ui/input';
import { api } from '~/lib/api';
import { useAuthStore } from '~/store/useAuthStore';
import { getErrorMessage } from '~/utils/getErrorMessage';

export function LoginPage() {
  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const handleFormSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const { email, password } = loginForm;
      const res = await api.post('/auth/login', {
        email,
        password,
      });

      if (res) {
        const { user, accessToken } = res.data;

        login(user, accessToken);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      toast.error(
        getErrorMessage(err, 'Đăng nhập thất bại. Vui lòng thử lại.'),
      );
    }
  };

  return (
    <main className="relative container mx-auto flex justify-center items-center min-h-screen max-w-312.5 px-4 sm:px-6">
      <div className="flex w-full max-w-4xl justify-center items-center lg:gap-20 md:gap-10">
        <div className="w-full max-w-100 p-6 sm:p-8 border border-border rounded-3xl bg-card shadow-xl dark:shadow-2xl/10 animate-in fade-in slide-in-from-left-4 duration-500">
          <form onSubmit={handleFormSubmit}>
            <div className="flex md:hidden items-center justify-center mb-4">
              <div className="flex items-center justify-center w-16 h-16 text-2xl font-black rounded-full border border-border text-foreground select-none">
                VN
              </div>
            </div>

            <FieldGroup className="gap-5">
              <FieldSet className="space-y-4">
                <div className="flex flex-col gap-1 text-center md:text-start">
                  <FieldLegend className="text-2xl! font-bold tracking-tight text-foreground">
                    Đăng nhập tài khoản
                  </FieldLegend>
                  <FieldDescription className="text-center md:text-start text-sm text-muted-foreground px-6 md:px-0">
                    Nhập thông tin đăng nhập của bạn để tiếp tục sử dụng hệ
                    thống
                  </FieldDescription>
                </div>

                <FieldGroup className="gap-4">
                  <Field className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="email"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Email
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      className="h-11 rounded-xl border-border bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring transition-all"
                      required
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, email: e.target.value })
                      }
                    />
                  </Field>

                  <Field className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <FieldLabel
                        htmlFor="password"
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Mật khẩu
                      </FieldLabel>
                      <a
                        href="#forgot"
                        className="text-xs text-primary font-medium hover:underline cursor-pointer"
                      >
                        Quên mật khẩu?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-border bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring transition-all"
                      required
                      onChange={(e) =>
                        setLoginForm({ ...loginForm, password: e.target.value })
                      }
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>

              <FieldSeparator />

              <Field className="w-full">
                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl text-sm font-semibold cursor-pointer shadow-md transition-all active:scale-[0.98]"
                >
                  Tiếp tục
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Chưa có tài khoản?{' '}
            <a
              href="/register"
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Đăng ký ngay
            </a>
          </p>
        </div>

        <div className="hidden md:flex flex-col text-left max-w-md select-none animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center justify-center w-20 h-20 text-4xl font-black rounded-3xl border-2 border-border text-foreground bg-card shadow-sm mb-6">
            VN
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl mb-3">
            Không chỉ là những dòng chữ.
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Trạm dừng chân của những chú vịt hệ công nghệ. Nơi những ý tưởng
            điên rồ được viết lại thành bài học, và những dòng text khô khan trở
            thành câu chuyện đầy cảm hứng.
          </p>
        </div>
      </div>
    </main>
  );
}
