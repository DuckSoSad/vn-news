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
import { getErrorMessage } from '~/utils/getErrorMessage';

export function RegisterPage() {
  const navigate = useNavigate();

  const [registerForm, setRegisterForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleFormSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const { name, username, email, password, confirmPassword } = registerForm;

    if (password !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      await api.post('/auth/register', { name, username, email, password });

      toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error(getErrorMessage(err, 'Đăng ký thất bại. Vui lòng thử lại.'));
    }
  };

  return (
    <main className="relative container mx-auto flex justify-center items-center min-h-screen max-w-312.5 px-4 sm:px-6">
      <div className="flex w-full max-w-5xl justify-center items-center lg:gap-20 md:gap-10">
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
                    Đăng ký tài khoản
                  </FieldLegend>
                  <FieldDescription className="text-center md:text-start text-sm text-muted-foreground px-6 md:px-0">
                    Tạo tài khoản mới để bắt đầu sử dụng hệ thống
                  </FieldDescription>
                </div>

                <FieldGroup className="gap-4">
                  <div className="flex justify-between items-center gap-3">
                    <Field className="flex flex-col gap-1.5">
                      <FieldLabel
                        htmlFor="name"
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Họ và tên
                      </FieldLabel>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nguyễn Văn Mười"
                        className="h-11 rounded-xl border-border bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring transition-all"
                        required
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field className="flex flex-col gap-1.5">
                      <FieldLabel
                        htmlFor="name"
                        className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Danh xưng
                      </FieldLabel>
                      <Input
                        id="username"
                        type="text"
                        placeholder="example-username"
                        className="h-11 rounded-xl border-border bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring transition-all"
                        required
                        onChange={(e) =>
                          setRegisterForm({
                            ...registerForm,
                            username: e.target.value,
                          })
                        }
                      />
                    </Field>
                  </div>

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
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="password"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Mật khẩu
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-border bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring transition-all"
                      required
                      minLength={6}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
                    />
                  </Field>

                  <Field className="flex flex-col gap-1.5">
                    <FieldLabel
                      htmlFor="confirmPassword"
                      className="text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      Xác nhận mật khẩu
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="h-11 rounded-xl border-border bg-muted/30 focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring transition-all"
                      required
                      minLength={6}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          confirmPassword: e.target.value,
                        })
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
                  Đăng ký
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Đã có tài khoản?{' '}
            <a
              href="/login"
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              Đăng nhập ngay
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
