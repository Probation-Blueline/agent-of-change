import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  BookOpen,
  Bot,
  Eye,
  EyeOff,
  Info,
  LockKeyhole,
  LogIn,
  Mail,
  TrendingUp,
  UserRound,
  UserRoundPlus,
  X,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface LoginScreenProps {
  wordmark: ReactNode;
  onLogin: (remember: boolean) => void;
}

type AuthMode = "login" | "signup";

interface AuthErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const benefits = [
  {
    icon: BookOpen,
    title: "Adaptive — Học tập thích ứng",
    description: "Điều chỉnh linh hoạt theo trình độ, nhịp độ và mục tiêu của bạn.",
  },
  {
    icon: Bot,
    title: "Supportive — Luôn đồng hành",
    description: "Khích lệ, kiên nhẫn hướng dẫn bạn vượt qua từng bài tập khó.",
  },
  {
    icon: TrendingUp,
    title: "Knowledgeable — Giải thích từng bước",
    description: "Học sâu, nhớ lâu cùng phương pháp giảng giải mạch lạc, trực quan.",
  },
];

export function LoginScreen({ wordmark, onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (submitTimer.current) clearTimeout(submitTimer.current);
    };
  }, []);

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setErrors({});
    setShowForgotPassword(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    const normalizedEmail = email.trim();
    const nextErrors: AuthErrors = {};

    if (mode === "signup" && name.trim().length < 2) {
      nextErrors.name = "Vui lòng nhập họ tên của bạn.";
    }

    if (!normalizedEmail) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!emailPattern.test(normalizedEmail)) {
      nextErrors.email = "Email chưa đúng định dạng.";
    }

    if (!password) {
      nextErrors.password = "Vui lòng nhập mật khẩu.";
    } else if (password.length < (mode === "signup" ? 8 : 6)) {
      nextErrors.password = `Mật khẩu cần có ít nhất ${mode === "signup" ? 8 : 6} ký tự.`;
    }

    if (mode === "signup") {
      if (!confirmPassword) {
        nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu.";
      } else if (confirmPassword !== password) {
        nextErrors.confirmPassword = "Mật khẩu xác nhận chưa khớp.";
      }

      if (!acceptedTerms) {
        nextErrors.terms = "Bạn cần đồng ý với điều khoản để tiếp tục.";
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setShowForgotPassword(false);
    setIsSubmitting(true);
    submitTimer.current = setTimeout(() => {
      onLogin(mode === "signup" ? true : remember);
      submitTimer.current = null;
    }, 500);
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[1.05fr_0.95fr]">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-10 text-primary-foreground lg:flex xl:p-16">
        <div className="absolute -left-20 -top-20 size-72 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-24 size-96 rounded-full bg-accent/20" />
        <div className="absolute left-1/2 top-1/3 size-40 rounded-full border border-white/10" />

        <div className="relative z-10 flex w-full max-w-xl flex-col">
          <div className="flex items-center justify-between">
            <div className="rounded-md bg-white px-3.5 py-1.5 text-foreground shadow-sm">
              {wordmark}
            </div>
            <span className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white/90">
              Learn smarter. Grow further.
            </span>
          </div>

          <div className="my-auto py-8">
            <div className="mb-6 flex items-center gap-4 rounded-md border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
              <img
                src="/assets/ata/ata_sticker.png"
                alt="Ata mascot sticker - You can do it!"
                className="size-16 shrink-0 rounded-md object-contain"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Gia sư AI thích ứng</p>
                <p className="text-base font-extrabold text-white">Gặp gỡ Ata — Bạn đồng hành học tập của bạn</p>
                <p className="mt-0.5 text-xs text-zinc-300">Different Learners. Same Goal.</p>
              </div>
            </div>

            <div role="heading" aria-level={1} className="max-w-lg text-3xl font-extrabold leading-tight tracking-tight xl:text-4xl">
              Học đúng cách, tiến bộ xa hơn cùng ATA.
            </div>
            <p className="mt-3 max-w-lg text-sm font-semibold leading-relaxed text-primary-foreground/80">
              Ata lắng nghe phong cách học của bạn, gợi ý bài tập phù hợp và luôn sẵn sàng hỗ trợ từng bước.
            </p>

            <div className="mt-8 grid gap-3">
              {benefits.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-3.5 rounded-md border border-white/15 bg-white/10 p-3.5 backdrop-blur-sm"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/15">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black">{title}</p>
                    <p className="mt-0.5 text-xs font-medium leading-relaxed text-primary-foreground/75">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center sm:mb-8 lg:hidden">
            {wordmark}
          </div>

          <div className="rounded-lg border border-border bg-card p-5 sm:p-8">
            <div className="mb-7">
              <div role="heading" aria-level={1} className="text-2xl font-extrabold tracking-tight text-foreground">
                {mode === "login" ? "ATA AI xin chào!" : "Bắt đầu học cùng ATA"}
              </div>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
                {mode === "login"
                  ? "Đăng nhập để tiếp tục hành trình học tiếng Anh cùng ATA."
                  : "Tạo tài khoản miễn phí và xây dựng lộ trình học thích ứng dành riêng cho bạn."}
              </p>
            </div>

            {mode === "login" && showForgotPassword && (
              <Alert className="mb-5 border-primary/20 bg-primary/5">
                <Info />
                <AlertTitle>Khôi phục mật khẩu</AlertTitle>
                <AlertDescription>
                  Tính năng này cần kết nối backend. Trong bản demo, bạn có thể đăng nhập bằng bất kỳ email hợp lệ nào.
                </AlertDescription>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Đóng thông báo"
                  onClick={() => setShowForgotPassword(false)}
                  className="absolute right-2 top-2 size-7 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                >
                  <X size={14} />
                </Button>
              </Alert>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="font-black text-foreground">
                    Họ và tên
                  </Label>
                  <div className="relative">
                    <UserRound
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="signup-name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "signup-name-error" : undefined}
                      onChange={event => {
                        setName(event.target.value);
                        if (errors.name) setErrors(current => ({ ...current, name: undefined }));
                      }}
                      placeholder="Nguyễn An"
                      className="h-12 rounded-md border-border pl-10 text-sm font-semibold focus-visible:border-primary"
                      autoFocus
                    />
                  </div>
                  {errors.name && (
                    <p id="signup-name-error" role="alert" className="text-xs font-bold text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor={`${mode}-email`} className="font-black text-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id={`${mode}-email`}
                    type="email"
                    autoComplete="email"
                    value={email}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${mode}-email-error` : undefined}
                    onChange={event => {
                      setEmail(event.target.value);
                      if (errors.email) setErrors(current => ({ ...current, email: undefined }));
                    }}
                    placeholder="ban@example.com"
                    className="h-12 rounded-md border-border pl-10 text-sm font-semibold focus-visible:border-primary"
                    autoFocus={mode === "login"}
                  />
                </div>
                {errors.email && (
                  <p id={`${mode}-email-error`} role="alert" className="text-xs font-bold text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${mode}-password`} className="font-black text-foreground">
                  Mật khẩu
                </Label>
                <div className="relative">
                  <LockKeyhole
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id={`${mode}-password`}
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? `${mode}-password-error` : undefined}
                    onChange={event => {
                      setPassword(event.target.value);
                      if (errors.password) setErrors(current => ({ ...current, password: undefined }));
                    }}
                    placeholder={mode === "login" ? "Nhập mật khẩu của bạn" : "Tối thiểu 8 ký tự"}
                    className="h-12 rounded-md border-border px-10 text-sm font-semibold focus-visible:border-primary"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={isSubmitting}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setShowPassword(visible => !visible)}
                    className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </Button>
                </div>
                {errors.password && (
                  <p id={`${mode}-password-error`} role="alert" className="text-xs font-bold text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password" className="font-black text-foreground">
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <LockKeyhole
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      id="signup-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirmPassword}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={errors.confirmPassword ? "signup-confirm-password-error" : undefined}
                      onChange={event => {
                        setConfirmPassword(event.target.value);
                        if (errors.confirmPassword) {
                          setErrors(current => ({ ...current, confirmPassword: undefined }));
                        }
                      }}
                      placeholder="Nhập lại mật khẩu"
                      className="h-12 rounded-md border-border px-10 text-sm font-semibold focus-visible:border-primary"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      disabled={isSubmitting}
                      aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
                      onClick={() => setShowConfirmPassword(visible => !visible)}
                      className="absolute right-1.5 top-1/2 size-9 -translate-y-1/2 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                    >
                      {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p id="signup-confirm-password-error" role="alert" className="text-xs font-bold text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {mode === "login" ? (
                <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember-login"
                      className="shadow-none"
                      checked={remember}
                      disabled={isSubmitting}
                      onCheckedChange={checked => setRemember(checked === true)}
                    />
                    <Label htmlFor="remember-login" className="cursor-pointer text-xs font-bold text-muted-foreground">
                      Ghi nhớ đăng nhập
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setShowForgotPassword(true)}
                    className="h-auto p-0 text-xs font-black text-primary hover:text-zinc-600"
                  >
                    Quên mật khẩu?
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="accept-terms"
                      className="shadow-none"
                      checked={acceptedTerms}
                      disabled={isSubmitting}
                      aria-invalid={Boolean(errors.terms)}
                      aria-describedby={errors.terms ? "signup-terms-error" : undefined}
                      onCheckedChange={checked => {
                        setAcceptedTerms(checked === true);
                        if (errors.terms) setErrors(current => ({ ...current, terms: undefined }));
                      }}
                    />
                    <Label htmlFor="accept-terms" className="cursor-pointer text-xs font-bold leading-relaxed text-muted-foreground">
                      Tôi đồng ý với Điều khoản sử dụng và Chính sách quyền riêng tư của ATA.
                    </Label>
                  </div>
                  {errors.terms && (
                    <p id="signup-terms-error" role="alert" className="text-xs font-bold text-destructive">
                      {errors.terms}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-md text-sm font-black"
              >
                {mode === "login" ? <LogIn size={17} /> : <UserRoundPlus size={17} />}
                {isSubmitting
                  ? mode === "login"
                    ? "Đang đăng nhập..."
                    : "Đang tạo tài khoản..."
                  : mode === "login"
                    ? "Đăng nhập"
                    : "Tạo tài khoản"}
              </Button>
            </form>

            <div className="mt-6 border-t border-border pt-5 text-center">
              <span className="text-xs font-semibold text-muted-foreground">
                {mode === "login" ? "Chưa có tài khoản?" : "Bạn đã có tài khoản?"}
              </span>{" "}
              <Button
                type="button"
                variant="link"
                disabled={isSubmitting}
                onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                className="h-auto p-0 text-xs font-black text-primary hover:text-zinc-600"
              >
                {mode === "login" ? "Đăng ký miễn phí" : "Đăng nhập"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
