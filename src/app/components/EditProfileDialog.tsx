import React, { useState, useEffect } from "react";
import {
  UserRound,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  GraduationCap,
  Award,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  grade: string;
  level: string;
  points: number;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onSave: (
    updated: UserProfile,
    passwordChange?: { current: string; next: string }
  ) => void;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GRADE_PRESETS = ["Lớp 10", "Lớp 11", "Lớp 12", "Đại học", "Tự do"];
const LEVEL_PRESETS = ["A2", "B1", "B1+", "B2", "IELTS 6.5+"];
const ROLE_PRESETS = ["Học viên", "Sinh viên", "Người tự học"];

export function EditProfileDialog({
  open,
  onOpenChange,
  profile,
  onSave,
}: EditProfileDialogProps) {
  const [activeTab, setActiveTab] = useState<"general" | "security">("general");

  // Profile fields state
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [grade, setGrade] = useState(profile.grade);
  const [role, setRole] = useState(profile.role);
  const [level, setLevel] = useState(profile.level);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors & submission state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize when dialog opens
  useEffect(() => {
    if (open) {
      setName(profile.name);
      setEmail(profile.email);
      setGrade(profile.grade);
      setRole(profile.role);
      setLevel(profile.level);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      setActiveTab("general");
    }
  }, [open, profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validate general info
    if (!name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên của bạn.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Họ và tên phải có tối thiểu 2 ký tự.";
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập địa chỉ email.";
    } else if (!emailPattern.test(email.trim())) {
      newErrors.email = "Định dạng email chưa hợp lệ (ví dụ: ban@example.com).";
    }

    // Validate password if user entered any password field
    const hasPasswordInput =
      Boolean(currentPassword) || Boolean(newPassword) || Boolean(confirmPassword);

    if (hasPasswordInput) {
      if (!currentPassword) {
        newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại.";
      }
      if (!newPassword) {
        newErrors.newPassword = "Vui lòng nhập mật khẩu mới.";
      } else if (newPassword.length < 6) {
        newErrors.newPassword = "Mật khẩu mới phải có tối thiểu 6 ký tự.";
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu mới.";
      } else if (confirmPassword !== newPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không trùng khớp.";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (
        newErrors.currentPassword ||
        newErrors.newPassword ||
        newErrors.confirmPassword
      ) {
        setActiveTab("security");
      } else {
        setActiveTab("general");
      }
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const updatedProfile: UserProfile = {
        ...profile,
        name: name.trim(),
        email: email.trim(),
        grade: grade.trim() || profile.grade,
        role: role.trim() || profile.role,
        level: level.trim() || profile.level,
      };

      const passwordChange = hasPasswordInput
        ? { current: currentPassword, next: newPassword }
        : undefined;

      onSave(updatedProfile, passwordChange);
      setIsSubmitting(false);
      onOpenChange(false);
    }, 250);
  };

  const previewInitials = getInitials(name || profile.name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl sm:max-w-2xl rounded-xl bg-white/95 backdrop-blur-2xl border border-zinc-200/90 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.18)] p-0 overflow-hidden text-foreground">
        {/* Top Header Card */}
        <div className="border-b border-zinc-200/80 bg-zinc-50/70 px-6 py-5 pr-14 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white border border-zinc-200/80 px-2.5 py-1 text-[11px] font-bold text-zinc-900 shadow-2xs">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> Tài khoản ATA
            </span>
            <span className="text-[11px] font-medium text-zinc-400">·</span>
            <span className="text-[11px] font-semibold text-zinc-500">Different Learners. Same Goal.</span>
          </div>
          <div className="mt-2.5">
            <DialogTitle className="text-xl font-bold tracking-tight text-zinc-950">
              Chỉnh sửa hồ sơ cá nhân
            </DialogTitle>
            <DialogDescription className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Cập nhật họ tên, thông tin học tập và phương thức bảo mật tài khoản ATA của bạn.
            </DialogDescription>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {/* Magazine Style Segmented Pill Switcher */}
            <div className="flex items-center gap-1.5 rounded-lg bg-zinc-100 p-1 border border-zinc-200/80">
              <button
                type="button"
                onClick={() => setActiveTab("general")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "general"
                    ? "bg-zinc-950 !text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-white/80"
                }`}
              >
                <UserRound size={14} className={activeTab === "general" ? "text-white" : "text-zinc-500"} />
                <span>Thông tin cá nhân</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "security"
                    ? "bg-zinc-950 !text-white shadow-xs"
                    : "text-zinc-600 hover:text-zinc-950 hover:bg-white/80"
                }`}
              >
                <ShieldCheck size={14} className={activeTab === "security" ? "text-white" : "text-zinc-500"} />
                <span>Bảo mật & Mật khẩu</span>
              </button>
            </div>

            {activeTab === "general" ? (
              <div className="space-y-4">
                {/* Live Avatar Preview Card - strictly mirrors ProfileScreen card */}
                <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 p-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-zinc-200/60 pb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Thẻ nhận diện ATA</span>
                    <span className="rounded-md bg-white border border-zinc-200/80 px-2 py-0.5 text-[10px] font-bold text-zinc-800 shadow-2xs">
                      Đồng bộ tức thì
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-base font-bold text-white shadow-xs">
                      {previewInitials}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-zinc-950">
                        {name.trim() || "Chưa nhập họ tên"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground font-medium">
                        {role || "Học viên"} · {grade || "Lớp 12"}
                      </p>
                      <p className="mt-1 inline-flex items-center gap-1.5 truncate text-[11px] font-medium text-zinc-500">
                        <Mail size={12} className="shrink-0" />
                        <span className="truncate">{email || "chua-co-email@example.com"}</span>
                      </p>
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-right shrink-0 border-l border-zinc-200/70 pl-4">
                      <span className="rounded-md bg-white border border-zinc-200 px-2 py-0.5 text-xs font-bold text-zinc-900 shadow-2xs">
                        {level || "B1+"}
                      </span>
                      <span className="mt-1 text-[10px] text-muted-foreground">Trình độ hiện tại</span>
                    </div>
                  </div>
                </div>

                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="profile-name" className="text-xs font-bold text-zinc-900">
                    Họ và tên <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <UserRound
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <Input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={e => {
                        setName(e.target.value);
                        if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                      }}
                      placeholder="Ví dụ: Nguyễn An"
                      className="h-10 rounded-md border border-zinc-200/90 bg-white pl-10 pr-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 shadow-2xs transition-all focus-visible:border-zinc-950 focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <Label htmlFor="profile-email" className="text-xs font-bold text-zinc-900">
                    Địa chỉ Email <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <Input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                      }}
                      placeholder="Ví dụ: an.nguyen@example.com"
                      className="h-10 rounded-md border border-zinc-200/90 bg-white pl-10 pr-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 shadow-2xs transition-all focus-visible:border-zinc-950 focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.email}
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Email dùng để đồng bộ tiến độ học tập và thông báo bài kiểm tra từ trợ lý ATA.
                  </p>
                </div>

                {/* Grade and Level Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* Grade */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="profile-grade" className="text-xs font-bold text-zinc-900">
                        Lớp / Khối học
                      </Label>
                    </div>
                    <div className="relative">
                      <GraduationCap
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                      <Input
                        id="profile-grade"
                        type="text"
                        value={grade}
                        onChange={e => setGrade(e.target.value)}
                        placeholder="Lớp 12"
                        className="h-10 rounded-md border border-zinc-200/90 bg-white pl-10 pr-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 shadow-2xs transition-all focus-visible:border-zinc-950 focus-visible:ring-1 focus-visible:ring-zinc-950"
                      />
                    </div>
                    {/* Preset Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {GRADE_PRESETS.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setGrade(p)}
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold border transition-all cursor-pointer ${
                            grade === p
                              ? "bg-zinc-950 text-white border-zinc-950 shadow-2xs"
                              : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-950"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="profile-level" className="text-xs font-bold text-zinc-900">
                        Trình độ hiện tại
                      </Label>
                    </div>
                    <div className="relative">
                      <Award
                        size={16}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                      <Input
                        id="profile-level"
                        type="text"
                        value={level}
                        onChange={e => setLevel(e.target.value)}
                        placeholder="B1+"
                        className="h-10 rounded-md border border-zinc-200/90 bg-white pl-10 pr-3 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 shadow-2xs transition-all focus-visible:border-zinc-950 focus-visible:ring-1 focus-visible:ring-zinc-950"
                      />
                    </div>
                    {/* Preset Chips */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {LEVEL_PRESETS.map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setLevel(p)}
                          className={`rounded px-2 py-0.5 text-[10px] font-semibold border transition-all cursor-pointer ${
                            level === p
                              ? "bg-zinc-950 text-white border-zinc-950 shadow-2xs"
                              : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-950"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Role quick selector */}
                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs font-bold text-zinc-900">
                    Vai trò học tập
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {ROLE_PRESETS.map(r => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                          role === r
                            ? "bg-zinc-950 text-white border-zinc-950 shadow-2xs"
                            : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-950"
                        }`}
                      >
                        {role === r && <Check size={12} />}
                        <span>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Security Banner Card */}
                <div className="rounded-lg border border-zinc-200/80 bg-zinc-50/70 p-4 flex items-start gap-3.5 shadow-2xs">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-zinc-950 text-white shadow-2xs mt-0.5">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-zinc-950">Bảo mật tài khoản ATA</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Mật khẩu mới yêu cầu tối thiểu 6 ký tự. Sau khi đổi mật khẩu, dữ liệu sẽ được đồng bộ ngay lập tức và giữ nguyên phiên học của bạn.
                    </p>
                  </div>
                </div>

                {/* Current Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="current-pw" className="text-xs font-bold text-zinc-900">
                    Mật khẩu hiện tại
                  </Label>
                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <Input
                      id="current-pw"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={e => {
                        setCurrentPassword(e.target.value);
                        if (errors.currentPassword)
                          setErrors(prev => ({ ...prev, currentPassword: "" }));
                      }}
                      placeholder="Nhập mật khẩu hiện tại của bạn"
                      className="h-10 rounded-md border border-zinc-200/90 bg-white px-10 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 shadow-2xs transition-all focus-visible:border-zinc-950 focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
                      aria-label={showCurrentPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="new-pw" className="text-xs font-bold text-zinc-900">
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <KeyRound
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <Input
                      id="new-pw"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={e => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword)
                          setErrors(prev => ({ ...prev, newPassword: "" }));
                      }}
                      placeholder="Tối thiểu 6 ký tự"
                      className="h-10 rounded-md border border-zinc-200/90 bg-white px-10 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 shadow-2xs transition-all focus-visible:border-zinc-950 focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
                      aria-label={showNewPassword ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"}
                    >
                      {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.newPassword}
                    </p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-new-pw" className="text-xs font-bold text-zinc-900">
                    Xác nhận mật khẩu mới
                  </Label>
                  <div className="relative">
                    <LockKeyhole
                      size={16}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
                    />
                    <Input
                      id="confirm-new-pw"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword)
                          setErrors(prev => ({ ...prev, confirmPassword: "" }));
                      }}
                      placeholder="Nhập lại mật khẩu mới"
                      className="h-10 rounded-md border border-zinc-200/90 bg-white px-10 text-sm font-semibold text-zinc-950 placeholder:text-zinc-400 shadow-2xs transition-all focus-visible:border-zinc-950 focus-visible:ring-1 focus-visible:ring-zinc-950"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
                      aria-label={showConfirmPassword ? "Ẩn xác nhận mật khẩu" : "Hiện xác nhận mật khẩu"}
                    >
                      {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-[11px] font-bold text-red-600 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.confirmPassword}
                    </p>
                  )}
                  {newPassword && confirmPassword && newPassword === confirmPassword && (
                    <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 size={12} /> Mật khẩu xác nhận đã trùng khớp.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-zinc-200/80 bg-zinc-50/70 px-6 py-4">
            <p className="hidden sm:block text-[11px] text-muted-foreground">
              Thay đổi sẽ áp dụng ngay tức thì trên toàn bộ hệ thống.
            </p>
            <div className="flex items-center gap-2.5 ml-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="h-9 rounded-md border border-zinc-200 bg-white px-4 text-xs font-bold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-all cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-9 rounded-md bg-zinc-950 px-5 text-xs font-bold text-white shadow-xs hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Đang lưu...</>
                ) : (
                  <>
                    <Save size={13} /> Lưu thay đổi
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
