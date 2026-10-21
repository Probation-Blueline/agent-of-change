import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowRight,
  Bell,
  BookOpen,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  FileUp,
  FolderOpen,
  GraduationCap,
  History,
  Home,
  Library,
  Lightbulb,
  Link2,
  LogOut,
  Menu,
  MessageSquareText,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Settings,
  Sparkles,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Trophy,
  UploadCloud,
  X,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { ScrollArea } from "./components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./components/ui/sheet";
import { Textarea } from "./components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { LoginScreen } from "./components/LoginScreen";

type View = "home" | "chat" | "resources" | "profile";
type ResourceType = "Tất cả" | "Tài liệu" | "Bài tập" | "Lộ trình";

interface ChatMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  error?: boolean;
}

const AUTH_STORAGE_KEY = "ata-authenticated";
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1531496378573-7be09a2697d8?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200";

interface LibraryResource {
  id: string | number;
  type: "Tài liệu" | "Bài tập" | "Lộ trình";
  icon: any;
  title: string;
  description: string;
  meta: string;
  pages: number;
  tone: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  fileFormat?: "pdf" | "doc" | "docx";
  isUserUploaded?: boolean;
  uploadedAt?: string;
  notes?: string;
}

const defaultResources: LibraryResource[] = [
  { id: 1, type: "Lộ trình", icon: GraduationCap, title: "Lộ trình IELTS 6.5 trong 16 tuần", description: "Kế hoạch học từng tuần, bài kiểm tra đầu vào và mốc đánh giá tiến độ.", meta: "16 tuần · 32 trang", pages: 32, tone: "bg-zinc-100 text-zinc-900", fileFormat: "pdf" },
  { id: 2, type: "Tài liệu", icon: FileText, title: "Tổng hợp ngữ pháp THPT trọng tâm", description: "Hệ thống 18 chuyên đề ngữ pháp kèm ví dụ và bài tập có đáp án.", meta: "PDF · 48 trang", pages: 48, tone: "bg-zinc-100 text-zinc-900", fileFormat: "pdf" },
  { id: 3, type: "Bài tập", icon: BrainCircuit, title: "Bộ đề luyện đọc hiểu B1–B2", description: "12 bài đọc theo chủ đề với giải thích từ vựng và chiến lược làm bài.", meta: "DOCX · 24 trang", pages: 24, tone: "bg-zinc-100 text-zinc-900", fileFormat: "docx" },
  { id: 4, type: "Tài liệu", icon: BookOpen, title: "300 từ vựng học thuật thông dụng", description: "Flashcard có ví dụ theo ngữ cảnh, phát âm và lịch ôn tập ngắt quãng.", meta: "PDF · 36 trang", pages: 36, tone: "bg-zinc-100 text-zinc-900", fileFormat: "pdf" },
  { id: 5, type: "Bài tập", icon: Clipboard, title: "Luyện viết câu học thuật", description: "Thực hành diễn đạt lại câu và nhận gợi ý cải thiện từ ATA AI.", meta: "DOCX · 20 trang", pages: 20, tone: "bg-zinc-100 text-zinc-900", fileFormat: "docx" },
  { id: 6, type: "Lộ trình", icon: TrendingUp, title: "Ôn thi tiếng Anh THPT Quốc gia", description: "Lộ trình 8 tuần bám sát cấu trúc đề, ưu tiên các phần dễ mất điểm.", meta: "PDF · 56 trang", pages: 56, tone: "bg-zinc-100 text-zinc-900", fileFormat: "pdf" },
];

const quickActions = [
  { icon: Bot, title: "Hỏi ATA AI", description: "Giải thích bài tập tức thì", view: "chat" as View, tone: "bg-zinc-100 text-zinc-900", mascot: "/assets/ata/ata_happy.png" },
  { icon: Library, title: "Tra cứu tài liệu", description: "Tìm giáo trình và bài tập", view: "resources" as View, tone: "bg-zinc-100 text-zinc-900" },
  { icon: Zap, title: "Luyện nhanh 10 phút", description: "Bài học ngắn theo mục tiêu", view: "resources" as View, tone: "bg-zinc-100 text-zinc-900" },
  { icon: TrendingUp, title: "Xem tiến độ", description: "Theo dõi mục tiêu tuần", view: "profile" as View, tone: "bg-zinc-100 text-zinc-900" },
];

const suggestedPrompts = [
  {
    text: "Giải thích bài toán này theo từng bước",
    pose: "/assets/ata/ata_explaining.png",
    label: "Explaining",
  },
  {
    text: "Gợi ý lộ trình ôn thi IELTS 6.5",
    pose: "/assets/ata/ata_thinking.png",
    label: "Thinking",
  },
  {
    text: "Kiểm tra và sửa đoạn văn tiếng Anh",
    pose: "/assets/ata/ata_encouraging.png",
    label: "Encouraging",
  },
  {
    text: "Tạo 5 câu hỏi ôn tập về thì quá khứ",
    pose: "/assets/ata/ata_excited.png",
    label: "Excited",
  },
];

function AtaLogo({ size = 36 }: { size?: number }) {
  return (
    <img
      src="/assets/ata/ata_icon.png"
      alt="ATA Logo"
      className="rounded-md object-contain shadow-xs"
      style={{ width: size, height: size }}
    />
  );
}

function AtaWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 whitespace-nowrap ${className}`} aria-label="ATA - Adaptive Tutoring Agent">
      <img
        src="/assets/ata/ata_icon.png"
        alt="ATA Icon"
        className="size-8 rounded-md object-contain"
      />
      <span className="flex flex-col text-left leading-none">
        <span className="text-xl font-black tracking-wide text-foreground">ATA</span>
        <span className="text-[10px] font-semibold text-muted-foreground tracking-tight">Adaptive Tutoring Agent</span>
      </span>
    </span>
  );
}

function PageTitle({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div>
      {eyebrow && <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p>}
      <div role="heading" aria-level={1} className="text-3xl font-bold tracking-tight text-foreground">{title}</div>
      {description && <p className="mt-2 max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>}
    </div>
  );
}

function SectionHeading({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        <div role="heading" aria-level={2} className="text-xl font-bold tracking-tight">{title}</div>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

function AppHeader({ view, setView, onLogout }: { view: View; setView: (view: View) => void; onLogout: () => void }) {
  const navItems = [
    { label: "Trang chủ", value: "home" as View, icon: Home },
    { label: "Trợ lý ATA", value: "chat" as View, icon: Bot },
    { label: "Thư viện", value: "resources" as View, icon: Library },
    { label: "Tiến độ", value: "profile" as View, icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-40 shrink-0 border-b border-border bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:px-6 lg:h-16 lg:flex-nowrap lg:justify-start lg:gap-6 lg:px-8 lg:py-0">
        <Button type="button" variant="ghost" onClick={() => setView("home")} className="h-auto shrink-0 gap-2.5 p-0 hover:bg-transparent" aria-label="Về trang chủ">
          <AtaWordmark className="h-8 text-foreground" />
        </Button>
        <nav className="order-last grid h-11 w-full grid-cols-4 items-center gap-1 lg:order-none lg:flex lg:h-full lg:flex-1 lg:justify-center" aria-label="Điều hướng chính">
          {navItems.map(({ label, value, icon: Icon }) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              onClick={() => setView(value)}
              className={`h-9 min-w-0 rounded-md px-1.5 text-xs font-semibold transition-colors sm:px-3 sm:text-sm md:px-4 ${
                view === value
                  ? "bg-secondary text-primary hover:bg-zinc-200 hover:text-zinc-950"
                  : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
              }`}
            >
              <Icon size={16} className="shrink-0" /> <span className="truncate">{label}</span>
            </Button>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <Button type="button" variant="ghost" size="icon" className="relative hidden size-9 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 sm:inline-flex" aria-label="Thông báo">
            <Bell size={17} />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-primary" />
          </Button>
          <Button type="button" variant="ghost" onClick={() => setView("profile")} className="group h-9 gap-2.5 rounded-md px-2 hover:bg-zinc-100 hover:text-zinc-950">
            <span className="flex size-7 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-white">NA</span>
            <span className="hidden text-left xl:block">
              <span className="block text-sm font-semibold leading-none text-foreground group-hover:text-zinc-950 transition-colors">Nguyễn An</span>
              <span className="mt-1 block text-[11px] font-medium text-muted-foreground group-hover:text-zinc-700 transition-colors">Học viên</span>
            </span>
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onLogout} className="size-9 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950" aria-label="Đăng xuất">
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </header>
  );
}

function HomeScreen({ setView, askAI, resources = defaultResources }: { setView: (view: View) => void; askAI: (prompt: string) => void; resources?: LibraryResource[] }) {
  const [query, setQuery] = useState("");
  const submit = () => {
    if (query.trim()) askAI(query.trim());
    else setView("chat");
  };

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <section className="grid overflow-hidden rounded-lg border border-border bg-white shadow-xs lg:min-h-[390px] lg:grid-cols-12">
        <div className="flex flex-col justify-center p-5 sm:p-8 lg:col-span-7 lg:p-10 xl:p-12">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-semibold text-zinc-900">
            <Sparkles size={14} /> Meet Ata · Adaptive Tutoring Agent
          </div>
          <div role="heading" aria-level={1} className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl">
            Học đúng cách, tiến bộ nhanh hơn cùng Ata.
          </div>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
            Ata là gia sư AI thích ứng thấu hiểu phong cách học, hỗ trợ giải đáp từng bước và cùng bạn bứt phá mục tiêu. Learn smarter. Grow further.
          </p>
          <div className="mt-7 flex max-w-2xl items-center gap-1 rounded-md border border-border bg-zinc-50/50 p-1.5 focus-within:border-primary focus-within:ring-2 focus-within:ring-zinc-950/10 sm:gap-2">
            <span className="ml-1 hidden size-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-zinc-200 bg-white sm:flex">
              <img src="/assets/ata/ata_avatar.png" alt="Ata" className="size-full object-cover" />
            </span>
            <Input
              value={query}
              onChange={event => setQuery(event.target.value)}
              onKeyDown={event => event.key === "Enter" && submit()}
              className="h-10 min-w-0 flex-1 border-0 bg-transparent px-2 text-sm shadow-none focus-visible:ring-0 sm:text-base"
              placeholder="Hỏi Ata bất kỳ điều gì..."
              aria-label="Nhập câu hỏi cho Ata"
            />
            <Button type="button" onClick={submit} className="h-10 shrink-0 rounded-md px-3 font-semibold shadow-none sm:px-5">
              <span className="hidden sm:inline">Hỏi ngay</span> <ArrowRight size={15} />
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Gợi ý: “Lập kế hoạch ôn IELTS 6.5 trong 4 tháng”</p>
        </div>
        <div className="relative m-4 mt-0 flex flex-col justify-between overflow-hidden rounded-lg border border-border bg-gradient-to-b from-zinc-50 via-white to-zinc-50 p-5 lg:col-span-5 lg:m-5 lg:ml-0">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-bold text-zinc-900 shadow-2xs">
              <span className="size-1.5 rounded-full bg-emerald-500" /> Đồng hành cùng bạn
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">Different Learners. Same Goal.</span>
          </div>

          <div className="my-auto flex items-center justify-center py-4">
            <img
              src="/assets/ata/ata_hero.png"
              alt="Ata - Adaptive Tutoring Agent Mascot"
              className="max-h-56 w-auto object-contain drop-shadow-sm transition-transform hover:scale-105 duration-300"
            />
          </div>

          <div className="space-y-3">
            {/* Real use goal card */}
            <div className="rounded-md border border-zinc-200 bg-white p-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <img src="/assets/ata/ata_happy.png" alt="Ata Happy" className="size-8 rounded-md object-contain" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-zinc-900 truncate">Mục tiêu tuần này</p>
                  <p className="text-[11px] text-zinc-500 truncate">4/5 buổi học đã hoàn thành</p>
                </div>
                <span className="text-xs font-bold text-zinc-900">80%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-md bg-zinc-100">
                <div className="h-full w-4/5 rounded-md bg-zinc-950" />
              </div>
            </div>

            {/* 4 ATA Principles from image */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 rounded-md bg-zinc-100/80 px-2.5 py-1.5 font-medium text-zinc-800">
                <span className="text-xs">🎓</span> <span>Adaptive</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-zinc-100/80 px-2.5 py-1.5 font-medium text-zinc-800">
                <span className="text-xs">💙</span> <span>Supportive</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-zinc-100/80 px-2.5 py-1.5 font-medium text-zinc-800">
                <span className="text-xs">💡</span> <span>Knowledgeable</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-md bg-zinc-100/80 px-2.5 py-1.5 font-medium text-zinc-800">
                <span className="text-xs">🌱</span> <span>Always with you</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8" aria-labelledby="quick-access">
        <SectionHeading title="Bạn muốn làm gì?" description="Truy cập nhanh các công cụ học tập thường dùng" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickActions.map(({ icon: Icon, title, description, view, tone }) => (
            <Button
              key={title}
              type="button"
              variant="ghost"
              onClick={() => setView(view)}
              className="group h-auto justify-start rounded-lg border border-border bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-zinc-50/60 hover:shadow-xs"
            >
              <span className={`mr-3 flex size-10 shrink-0 items-center justify-center rounded-md ${tone}`}><Icon size={19} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground group-hover:text-zinc-950 transition-colors">{title}</span>
                <span className="mt-1 block text-xs font-normal text-muted-foreground group-hover:text-zinc-800 transition-colors">{description}</span>
              </span>
              <ChevronRight size={16} className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Button>
          ))}
        </div>
      </section>

      {/* ATA In Real Use Section */}
      <section className="py-4 pb-8" aria-labelledby="ata-real-use">
        <SectionHeading
          title="Đồng hành cùng Ata trong thực tế"
          description="Khám phá cách gia sư AI thích ứng linh hoạt theo từng bước tiến của bạn"
          action={
            <Button
              type="button"
              variant="outline"
              onClick={() => askAI("Ata ơi, hôm nay hãy đồng hành và hướng dẫn mình học bài mới nhé!")}
              className="rounded-md text-sm font-semibold text-zinc-900 hover:bg-zinc-100 hover:text-zinc-950"
            >
              Trò chuyện cùng Ata <ArrowRight size={15} />
            </Button>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {/* Real use 1: Nice try */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-zinc-400">
            <div>
              <div className="overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 p-2 flex items-center justify-center">
                <img
                  src="/assets/ata/use_nice_try.png"
                  alt="Nice try! Let's look at this step together. You can do it!"
                  className="max-h-36 w-auto object-contain"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-bold text-zinc-800">Supportive</span>
                <span className="text-xs font-semibold text-zinc-500">Khi gặp thử thách</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-zinc-900 leading-snug">
                "Nice try! Cùng xem lại bước này"
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-5">
                Khi giải sai hoặc chưa hiểu rõ, Ata kiên nhẫn khích lệ và cùng bạn phân tích từng bước nhỏ để tìm ra hướng đi đúng.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => askAI("Ata ơi, mình đang có một câu bài tập khó, hãy cùng mình giải từng bước nhé!")}
              className="mt-4 h-9 w-full rounded-md text-xs font-semibold text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950"
            >
              Hỏi bài tập khó <ArrowRight size={13} />
            </Button>
          </div>

          {/* Real use 2: Got it */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-zinc-400">
            <div>
              <div className="overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 p-2 flex items-center justify-center">
                <img
                  src="/assets/ata/use_got_it.png"
                  alt="Got it! That's a great understanding!"
                  className="max-h-36 w-auto object-contain"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-bold text-zinc-800">Knowledgeable</span>
                <span className="text-xs font-semibold text-zinc-500">Khi hiểu sâu bài</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-zinc-900 leading-snug">
                "Got it! Thấu hiểu sâu sắc"
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-5">
                Khi nắm bắt đúng bản chất, Ata giúp bạn khái quát hóa công thức, củng cố quy luật và ghi nhớ dài hạn.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => askAI("Ata ơi, giải thích giúp mình cốt lõi của bài học này theo cách trực quan nhất!")}
              className="mt-4 h-9 w-full rounded-md text-xs font-semibold text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950"
            >
              Giải thích khái niệm <ArrowRight size={13} />
            </Button>
          </div>

          {/* Real use 3: Level Up */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-white p-5 shadow-2xs transition-all hover:-translate-y-0.5 hover:border-zinc-400">
            <div>
              <div className="overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 p-2 flex items-center justify-center">
                <img
                  src="/assets/ata/use_level_up.png"
                  alt="Level Up! You're making real progress!"
                  className="max-h-36 w-auto object-contain"
                />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-bold text-zinc-800">Adaptive</span>
                <span className="text-xs font-semibold text-zinc-500">Mốc tiến độ</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-zinc-900 leading-snug">
                "Level Up! Bứt phá tiến độ"
              </h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-5">
                Mỗi mốc rèn luyện đều được Ata ghi nhận để tự động điều chỉnh độ khó phù hợp với đà phát triển của bạn.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setView("profile")}
              className="mt-4 h-9 w-full rounded-md text-xs font-semibold text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950"
            >
              Xem cột mốc của bạn <ArrowRight size={13} />
            </Button>
          </div>
        </div>
      </section>

      <section className="pb-10" aria-labelledby="featured-resources">
        <SectionHeading
          title="Tài liệu dành cho bạn"
          description="Đề xuất dựa trên mục tiêu và hoạt động gần đây"
          action={<Button type="button" variant="ghost" onClick={() => setView("resources")} className="rounded-md text-sm font-semibold text-primary hover:bg-secondary hover:text-zinc-950">Xem thư viện <ArrowRight size={15} /></Button>}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.slice(0, 3).map(({ id, icon: Icon, type, title, description, meta, pages, tone, isUserUploaded }) => (
            <article key={id} className={`group rounded-lg border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-xs ${isUserUploaded ? "border-zinc-900/40 ring-1 ring-zinc-900/10" : "border-border hover:border-zinc-400"}`}>
              <div className="flex items-start justify-between">
                <span className={`flex size-10 items-center justify-center rounded-md ${tone}`}><Icon size={19} /></span>
                <div className="flex items-center gap-1.5">
                  {isUserUploaded && (
                    <span className="rounded-md bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-bold text-zinc-900">
                      Của bạn
                    </span>
                  )}
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-700">{type}</span>
                </div>
              </div>
              <div role="heading" aria-level={3} className="mt-4 text-base font-bold leading-6 text-foreground group-hover:text-zinc-950 transition-colors">{title}</div>
              <p className="mt-2 min-h-10 text-sm leading-5 text-muted-foreground group-hover:text-zinc-800 transition-colors">{description}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                  <FileText size={12} className="text-primary" /> {pages} trang
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-medium text-muted-foreground">{meta}</span>
                <Button type="button" variant="ghost" onClick={() => setView("resources")} className="h-8 rounded-md px-2 text-xs font-semibold text-primary hover:bg-secondary hover:text-zinc-950">Mở tài liệu <ArrowRight size={13} /></Button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

interface ConversationItem {
  id: string;
  title: string;
  sampleUserMessage: string;
  sampleAiResponse: string;
  messages: ChatMessage[];
  createdAt?: string;
}

const initialConversations: ConversationItem[] = [
  {
    id: "ielts-65",
    title: "Lộ trình ôn thi IELTS 6.5 toàn diện trong 4 tháng",
    sampleUserMessage: "Lập kế hoạch ôn IELTS 6.5 trong 4 tháng cho người mới bắt đầu từ band 5.0",
    sampleAiResponse: "Chào bạn! Để đạt IELTS 6.5 từ nền tảng 5.0 trong 4 tháng, bạn nên phân bổ 3 giai đoạn: củng cố ngữ pháp & từ vựng học thuật (tháng 1), luyện kỹ năng nghe/đọc theo dạng bài (tháng 2-3), và luyện đề kết hợp sửa Writing/Speaking chuyên sâu (tháng 4).",
    messages: [
      { id: 101, role: "user", content: "Lập kế hoạch ôn IELTS 6.5 trong 4 tháng cho người mới bắt đầu từ band 5.0" },
      { id: 102, role: "assistant", content: "Chào bạn! Để đạt IELTS 6.5 từ nền tảng 5.0 trong 4 tháng, bạn nên phân bổ 3 giai đoạn: củng cố ngữ pháp & từ vựng học thuật (tháng 1), luyện kỹ năng nghe/đọc theo dạng bài (tháng 2-3), và luyện đề kết hợp sửa Writing/Speaking chuyên sâu (tháng 4)." },
    ],
  },
  {
    id: "present-perfect",
    title: "Giải thích thì hiện tại hoàn thành và các dấu hiệu nhận biết trọng tâm",
    sampleUserMessage: "Giải thích thì hiện tại hoàn thành, cách dùng và dấu hiệu nhận biết",
    sampleAiResponse: "Thì Hiện tại hoàn thành (Present Perfect - S + have/has + V3/ed) dùng để diễn tả hành động đã xảy ra trong quá khứ nhưng để lại kết quả ở hiện tại, hoặc hành động bắt đầu từ quá khứ và vẫn tiếp diễn. Các dấu hiệu quen thuộc: since, for, already, yet, just, ever, never.",
    messages: [
      { id: 201, role: "user", content: "Giải thích thì hiện tại hoàn thành, cách dùng và dấu hiệu nhận biết" },
      { id: 202, role: "assistant", content: "Thì Hiện tại hoàn thành (Present Perfect - S + have/has + V3/ed) dùng để diễn tả hành động đã xảy ra trong quá khứ nhưng để lại kết quả ở hiện tại, hoặc hành động bắt đầu từ quá khứ và vẫn tiếp diễn. Các dấu hiệu quen thuộc: since, for, already, yet, just, ever, never." },
    ],
  },
  {
    id: "task-2",
    title: "Sửa bài viết IELTS Writing Task 2 chủ đề Online Education",
    sampleUserMessage: "Sửa giúp mình bài viết IELTS Writing Task 2 về chủ đề giáo dục trực tuyến",
    sampleAiResponse: "Mình đã phân tích dàn bài và cách dùng từ của bạn. Bài viết có cấu trúc rõ ràng, tuy nhiên bạn cần chú ý tăng cường liên từ học thuật (Furthermore, Consequently) và tránh lỗi lặp từ 'advantage'.",
    messages: [
      { id: 301, role: "user", content: "Sửa giúp mình bài viết IELTS Writing Task 2 về chủ đề giáo dục trực tuyến" },
      { id: 302, role: "assistant", content: "Mình đã phân tích dàn bài và cách dùng từ của bạn. Bài viết có cấu trúc rõ ràng, tuy nhiên bạn cần chú ý tăng cường liên từ học thuật (Furthermore, Consequently) và tránh lỗi lặp từ 'advantage'." },
    ],
  },
  {
    id: "environment",
    title: "Tổng hợp từ vựng IELTS band 7+ chủ đề Environment & Nature",
    sampleUserMessage: "Cho mình danh sách 15 từ vựng IELTS band 7+ chủ đề môi trường",
    sampleAiResponse: "Dưới đây là một số từ vựng giá trị cao cho chủ đề Environment: biodiversity loss (suy giảm đa dạng sinh học), carbon footprint (dấu chân carbon), sustainable development (phát triển bền vững), environmental degradation (suy thoái môi trường), renewable energy sources (nguồn năng lượng tái tạo).",
    messages: [
      { id: 401, role: "user", content: "Cho mình danh sách 15 từ vựng IELTS band 7+ chủ đề môi trường" },
      { id: 402, role: "assistant", content: "Dưới đây là một số từ vựng giá trị cao cho chủ đề Environment: biodiversity loss (suy giảm đa dạng sinh học), carbon footprint (dấu chân carbon), sustainable development (phát triển bền vững), environmental degradation (suy thoái môi trường), renewable energy sources (nguồn năng lượng tái tạo)." },
    ],
  },
  {
    id: "reading-strategy",
    title: "Chiến thuật làm bài Reading Matching Headings tránh bẫy phổ biến",
    sampleUserMessage: "Mẹo làm dạng bài Matching Headings trong IELTS Reading không bị bẫy",
    sampleAiResponse: "Với dạng Matching Headings, tuyệt đối không đọc toàn bộ đoạn văn trước. Hãy đọc lướt câu chủ đề (thường là câu đầu hoặc cuối), gạch chân từ khóa khác biệt giữa các headings, và chú ý các từ chuyển ý (however, but, therefore).",
    messages: [
      { id: 501, role: "user", content: "Mẹo làm dạng bài Matching Headings trong IELTS Reading không bị bẫy" },
      { id: 502, role: "assistant", content: "Với dạng Matching Headings, tuyệt đối không đọc toàn bộ đoạn văn trước. Hãy đọc lướt câu chủ đề (thường là câu đầu hoặc cuối), gạch chân từ khóa khác biệt giữa các headings, và chú ý các từ chuyển ý (however, but, therefore)." },
    ],
  },
];

interface CompanionPoseData {
  id: string;
  name: string;
  label: string;
  badge: string;
  img: string;
  prompt: string;
  description: string;
}

const companionPosesList: CompanionPoseData[] = [
  {
    id: "nice_try",
    name: "Nice try!",
    label: "Encouraging",
    badge: "Supportive",
    img: "/assets/ata/use_nice_try.png",
    prompt: "Ata ơi, mình làm sai câu này, hãy cùng mình phân tích và giải thích từng bước nhé!",
    description: "Khích lệ bạn kiên trì và chia nhỏ thử thách.",
  },
  {
    id: "got_it",
    name: "Got it!",
    label: "Explaining",
    badge: "Knowledgeable",
    img: "/assets/ata/use_got_it.png",
    prompt: "Ata hãy giúp mình tổng hợp lại phương pháp giải quyết dạng bài tập này!",
    description: "Củng cố kiến thức sâu và logic bài học.",
  },
  {
    id: "level_up",
    name: "Level Up!",
    label: "Celebrating",
    badge: "Progress",
    img: "/assets/ata/use_level_up.png",
    prompt: "Ata ơi, mình vừa xong bài học hôm nay, hãy kiểm tra trình độ giúp mình để thăng hạng nhé!",
    description: "Ghi nhận nỗ lực và thúc đẩy tiến độ cá nhân.",
  },
  {
    id: "happy",
    name: "Happy",
    label: "Tươi vui",
    badge: "Positive",
    img: "/assets/ata/ata_happy.png",
    prompt: "Ata ơi, hôm nay có mẹo học tiếng Anh nào thú vị và dễ áp dụng không?",
    description: "Khởi đầu phiên học tràn đầy năng lượng.",
  },
  {
    id: "thinking",
    name: "Thinking",
    label: "Suy ngẫm",
    badge: "Adaptive",
    img: "/assets/ata/ata_thinking.png",
    prompt: "Ata hãy phân tích kỹ các bẫy thường gặp trong đề thi THPT nhé!",
    description: "Suy luận đa chiều và phân tích chi tiết.",
  },
  {
    id: "excited",
    name: "Excited",
    label: "Hào hứng",
    badge: "Active",
    img: "/assets/ata/ata_excited.png",
    prompt: "Đố Ata một câu hỏi ngữ pháp tiếng Anh nâng cao thử xem!",
    description: "Sẵn sàng đón nhận những bài tập khó hơn.",
  },
];

function ChatScreen({ initialPrompt }: { initialPrompt: string }) {
  const [conversations, setConversations] = useState<ConversationItem[]>(() => {
    if (initialPrompt) {
      const initialTitle = initialPrompt.length > 38 ? `${initialPrompt.slice(0, 38).trim()}...` : initialPrompt;
      const initItem: ConversationItem = {
        id: "conv-initial",
        title: initialTitle,
        sampleUserMessage: initialPrompt,
        sampleAiResponse: "",
        messages: [{ id: 1, role: "user", content: initialPrompt }],
        createdAt: "Vừa tạo",
      };
      return [initItem, ...initialConversations];
    }
    return initialConversations;
  });

  const [activeConvId, setActiveConvId] = useState<string | null>(() =>
    initialPrompt ? "conv-initial" : null
  );

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    initialPrompt ? [{ id: 1, role: "user", content: initialPrompt }] : []
  );

  const [historyOpen, setHistoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(Boolean(initialPrompt));
  const [attachment, setAttachment] = useState("");
  const [feedback, setFeedback] = useState<Record<number, "up" | "down">>({});
  const [activePoseId, setActivePoseId] = useState<string>("nice_try");
  const endRef = useRef<HTMLDivElement | null>(null);
  const nextId = useRef(initialPrompt ? 1 : 0);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing]);

  const answer = (prompt: string, convId?: string) => {
    const isNetworkError = prompt.toLocaleLowerCase("vi-VN").includes("lỗi mạng");
    const aiContent = isNetworkError
      ? "Không thể kết nối tới ATA AI. Vui lòng kiểm tra mạng và thử lại."
      : "Mình sẽ giúp bạn theo cách dễ hiểu nhất. Trước tiên, hãy xác định mục tiêu và chia nội dung thành các bước nhỏ. Với dạng bài này, bạn nên tập trung vào từ khóa, kiến thức nền liên quan và kiểm tra lại kết quả sau mỗi bước.";

    const aiMsg: ChatMessage = {
      id: ++nextId.current,
      role: "assistant",
      content: aiContent,
      error: isNetworkError,
    };

    setMessages(current => [...current, aiMsg]);
    setTyping(false);

    const targetId = convId || activeConvId;
    if (targetId) {
      setConversations(prev =>
        prev.map(c => {
          if (c.id === targetId) {
            return {
              ...c,
              sampleAiResponse: aiContent,
              messages: [...(c.messages || []), aiMsg],
            };
          }
          return c;
        })
      );
    }
  };

  useEffect(() => {
    if (!initialPrompt) return;
    const timer = window.setTimeout(() => answer(initialPrompt, "conv-initial"), 750);
    return () => window.clearTimeout(timer);
  }, [initialPrompt]);

  const send = (prompt?: string) => {
    const content = (prompt ?? input).trim();
    if (!content || typing) return;

    const userMsg: ChatMessage = {
      id: ++nextId.current,
      role: "user",
      content: attachment ? `${content}\nĐính kèm: ${attachment}` : content,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setAttachment("");
    setTyping(true);

    let targetConvId = activeConvId;
    if (!targetConvId) {
      targetConvId = `conv-${Date.now()}`;
      setActiveConvId(targetConvId);
      const title = content.length > 38 ? `${content.slice(0, 38).trim()}...` : content;
      const newConv: ConversationItem = {
        id: targetConvId,
        title,
        sampleUserMessage: content,
        sampleAiResponse: "",
        messages: newMessages,
        createdAt: "Vừa tạo",
      };
      setConversations(prev => [newConv, ...prev]);
    } else {
      setConversations(prev =>
        prev.map(c => {
          if (c.id === targetConvId) {
            const shouldRename = c.title === "Cuộc trò chuyện mới" || c.messages.length === 0;
            const updatedTitle = shouldRename
              ? (content.length > 38 ? `${content.slice(0, 38).trim()}...` : content)
              : c.title;
            return {
              ...c,
              title: updatedTitle,
              sampleUserMessage: shouldRename ? content : c.sampleUserMessage,
              messages: newMessages,
            };
          }
          return c;
        })
      );
    }

    window.setTimeout(() => answer(content, targetConvId), 750);
  };

  const retry = (id: number) => {
    setMessages(current => current.filter(message => message.id !== id));
    setTyping(true);
    window.setTimeout(() => answer("thử lại"), 650);
  };

  const handleNewConversation = () => {
    const active = conversations.find(c => c.id === activeConvId);
    if (active && active.messages.length === 0) {
      setMessages([]);
      setInput("");
      setAttachment("");
      setTyping(false);
      setHistoryOpen(false);
      return;
    }

    const newId = `conv-${Date.now()}`;
    const newConv: ConversationItem = {
      id: newId,
      title: "Cuộc trò chuyện mới",
      sampleUserMessage: "Bắt đầu cuộc trò chuyện mới với ATA AI",
      sampleAiResponse: "",
      messages: [],
      createdAt: "Vừa tạo",
    };

    setConversations(prev => [newConv, ...prev]);
    setActiveConvId(newId);
    setMessages([]);
    setInput("");
    setAttachment("");
    setTyping(false);
    setHistoryOpen(false);
  };

  const handleOpenConversation = (conv: ConversationItem) => {
    setActiveConvId(conv.id);
    setMessages(conv.messages && conv.messages.length > 0 ? conv.messages : [
      { id: ++nextId.current, role: "user", content: conv.sampleUserMessage },
      { id: ++nextId.current, role: "assistant", content: conv.sampleAiResponse },
    ]);
    setInput("");
    setAttachment("");
    setTyping(false);
    setHistoryOpen(false);
  };

  const handleDeleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
      setMessages([]);
    }
  };

  return (
    <main className="mx-auto grid h-full min-h-0 w-full max-w-[1440px] flex-1 grid-cols-1 grid-rows-1 overflow-hidden bg-white lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)_292px]">
      {/* Mobile Sheet Drawer for Conversation Management */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent side="left" className="flex h-full w-[85vw] max-w-xs flex-col p-0 sm:max-w-sm">
          <SheetHeader className="border-b border-border p-4 text-left">
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-md bg-secondary text-primary">
                <Bot size={18} />
              </span>
              <div>
                <SheetTitle className="text-base font-bold">Cuộc trò chuyện</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Quản lý và tiếp tục các phiên học của bạn
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <div className="flex min-h-0 flex-1 flex-col p-4">
            <Button
              type="button"
              onClick={handleNewConversation}
              className="h-11 w-full shrink-0 justify-start rounded-md font-semibold shadow-none"
            >
              <SquarePen size={17} /> Cuộc trò chuyện mới
            </Button>

            <div className="mb-2 mt-5 flex shrink-0 items-center justify-between px-1">
              <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Lịch sử cuộc trò chuyện</p>
              <History size={14} className="text-muted-foreground" />
            </div>

            <TooltipProvider delayDuration={50}>
              <ScrollArea className="min-h-0 flex-1 w-full">
                <div className="space-y-1 pr-1.5 w-full min-w-0">
                  {conversations.map((conv) => (
                    <div key={conv.id} className="group relative flex w-full min-w-0 items-center">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleOpenConversation(conv)}
                            className={`flex h-auto w-full max-w-full min-w-0 items-center justify-start overflow-hidden rounded-md py-2.5 pl-3 pr-8 text-left text-sm font-medium transition-colors ${
                              activeConvId === conv.id
                                ? "bg-secondary font-semibold text-primary hover:bg-zinc-200 hover:text-zinc-950"
                                : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                            }`}
                            title={conv.title}
                            aria-label={conv.title}
                          >
                            <MessageSquareText size={15} className={`shrink-0 transition-colors ${activeConvId === conv.id ? "text-primary" : "text-zinc-500 group-hover:text-primary"}`} />
                            <span className="block min-w-0 flex-1 truncate text-left text-ellipsis overflow-hidden whitespace-nowrap">
                              {conv.title}
                            </span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          align="start"
                          sideOffset={6}
                          className="z-50 max-w-xs rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white shadow-xl"
                        >
                          <p className="font-bold text-white text-xs">{conv.title}</p>
                          {conv.sampleUserMessage && (
                            <p className="mt-1 text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                              {conv.sampleUserMessage}
                            </p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteConversation(e, conv.id)}
                        className="absolute right-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 size-6 inline-flex items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-all"
                        title="Xóa cuộc trò chuyện"
                        aria-label={`Xóa cuộc trò chuyện ${conv.title}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TooltipProvider>

            <div className="mt-4 shrink-0 rounded-md border border-border bg-zinc-50 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <Sparkles size={14} className="text-primary" /> Mẹo sử dụng AI
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Nêu rõ môn học, mục tiêu và phần bạn chưa hiểu để nhận câu trả lời tốt hơn.
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden h-full min-h-0 flex-col overflow-hidden border-r border-border bg-zinc-50/70 p-4 lg:flex w-full min-w-0">
        <Button type="button" onClick={handleNewConversation} className="h-10 w-full shrink-0 justify-start rounded-md font-semibold shadow-none">
          <SquarePen size={16} /> Cuộc trò chuyện mới
        </Button>
        <div className="mb-2 mt-6 flex shrink-0 items-center justify-between px-2">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Gần đây</p>
          <History size={14} className="text-muted-foreground" />
        </div>
        <TooltipProvider delayDuration={50}>
          <ScrollArea className="min-h-0 flex-1 w-full">
            <div className="space-y-1 pr-1.5 w-full min-w-0">
              {conversations.map((conv) => (
                <div key={conv.id} className="group relative flex w-full min-w-0 items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => handleOpenConversation(conv)}
                        className={`flex h-auto w-full max-w-full min-w-0 items-center justify-start overflow-hidden rounded-md py-2.5 pl-3 pr-8 text-left text-sm font-medium transition-colors ${
                          activeConvId === conv.id
                            ? "bg-white text-zinc-950 font-semibold shadow-xs ring-1 ring-border hover:bg-zinc-50 hover:text-zinc-950"
                            : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                        }`}
                        title={conv.title}
                        aria-label={conv.title}
                      >
                        <MessageSquareText size={15} className={`shrink-0 transition-colors ${activeConvId === conv.id ? "text-primary" : "text-zinc-500 group-hover:text-primary"}`} />
                        <span className="block min-w-0 flex-1 truncate text-left text-ellipsis overflow-hidden whitespace-nowrap">
                          {conv.title}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      side="right"
                      align="center"
                      sideOffset={10}
                      className="z-50 max-w-xs rounded-md border border-zinc-800 bg-zinc-900 px-3.5 py-2 text-xs text-white shadow-xl pointer-events-none"
                    >
                      <p className="font-bold text-white text-xs">{conv.title}</p>
                      {conv.sampleUserMessage && (
                        <p className="mt-1 text-[11px] text-zinc-300 line-clamp-2 leading-relaxed">
                          {conv.sampleUserMessage}
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteConversation(e, conv.id)}
                    className="absolute right-1.5 opacity-0 group-hover:opacity-100 focus:opacity-100 size-6 inline-flex items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 transition-all"
                    title="Xóa cuộc trò chuyện"
                    aria-label={`Xóa cuộc trò chuyện ${conv.title}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TooltipProvider>
        <div className="mt-4 shrink-0 rounded-md border border-border bg-white p-3">
          <div className="flex items-center gap-2 text-xs font-semibold"><Sparkles size={14} className="text-primary" /> Mẹo sử dụng AI</div>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">Nêu rõ môn học, mục tiêu và phần bạn chưa hiểu để nhận câu trả lời tốt hơn.</p>
        </div>
      </aside>

      <section className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-white" aria-label="Trò chuyện với ATA AI">
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-3 sm:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setHistoryOpen(true)}
              className="size-9 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 lg:hidden"
              aria-label="Mở danh sách cuộc trò chuyện"
              title="Mở cuộc trò chuyện"
            >
              <History size={18} />
            </Button>
            <img
              src="/assets/ata/ata_avatar.png"
              alt="Ata"
              className="size-9 rounded-md border border-zinc-200 object-cover shadow-2xs"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">ATA AI (Ata)</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-emerald-500" /> Gia sư thích ứng · Sẵn sàng
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHistoryOpen(true)}
              className="h-9 gap-1.5 rounded-md border-border px-2.5 text-xs font-semibold text-zinc-700 shadow-none hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-300 lg:hidden"
              aria-label="Mở cuộc trò chuyện"
              title="Mở danh sách cuộc trò chuyện"
            >
              <History size={14} className="text-primary" />
              <span>Mở</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleNewConversation}
              className="h-9 gap-1.5 rounded-md px-2.5 text-xs font-semibold shadow-none sm:px-3 sm:text-sm"
              aria-label="Tạo cuộc trò chuyện mới"
              title="Tạo cuộc trò chuyện mới"
            >
              <SquarePen size={15} />
              <span className="hidden xs:inline sm:inline">Hội thoại mới</span>
              <span className="xs:hidden sm:hidden">Mới</span>
            </Button>
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          {messages.length === 0 ? (
            <div className="mx-auto flex min-h-full max-w-2xl flex-col items-center justify-center px-4 py-8 text-center sm:px-8">
              <div className="relative mb-2 flex items-center justify-center">
                <img
                  src="/assets/ata/ata_hero.png"
                  alt="Ata mascot"
                  className="size-24 object-contain drop-shadow-sm transition-transform hover:scale-105 duration-300"
                />
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-bold text-zinc-800">
                <Sparkles size={13} className="text-zinc-600" /> Different Learners. Same Goal.
              </span>
              <div role="heading" aria-level={1} className="mt-3 text-2xl font-bold tracking-tight">
                Hôm nay bạn muốn học gì cùng Ata?
              </div>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
                Đặt câu hỏi, gửi bài tập hoặc yêu cầu Ata đồng hành giải thích từng bước rõ ràng.
              </p>
              <div className="mt-7 grid w-full gap-3 sm:grid-cols-2">
                {suggestedPrompts.map(({ text, pose, label }) => (
                  <Button
                    key={text}
                    type="button"
                    variant="outline"
                    onClick={() => send(text)}
                    className="group h-auto min-h-16 justify-start whitespace-normal rounded-md border-border bg-white p-3 text-left transition-all hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-950 shadow-xs"
                  >
                    <img
                      src={pose}
                      alt={label}
                      className="mr-3 size-10 shrink-0 rounded-md object-contain border border-zinc-200/80 bg-zinc-50 p-0.5"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-zinc-700">
                        {label}
                      </span>
                      <span className="block text-sm font-medium leading-5 text-zinc-900 group-hover:text-zinc-950 transition-colors">
                        {text}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setHistoryOpen(true)}
                className="mt-4 gap-2 rounded-md border-dashed border-border px-4 py-2 text-xs font-semibold text-zinc-700 shadow-none hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-300 lg:hidden"
              >
                <History size={14} className="text-primary" /> Mở cuộc trò chuyện trước đây
              </Button>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-3xl space-y-7 px-4 py-6 sm:px-8 sm:py-7">
              {messages.map(message => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && (
                    <img
                      src="/assets/ata/ata_avatar.png"
                      alt="Ata"
                      className="size-9 shrink-0 rounded-md border border-zinc-200 object-cover shadow-2xs"
                    />
                  )}
                  <div className={`max-w-[88%] sm:max-w-[82%] ${message.role === "user" ? "order-first" : ""}`}>
                    <div className={`rounded-lg px-4 py-3 text-[15px] leading-7 ${message.role === "user" ? "rounded-tr-xs bg-primary text-white" : message.error ? "rounded-tl-xs border border-red-200 bg-red-50 text-red-800" : "rounded-tl-xs border border-border bg-zinc-50 text-foreground"}`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      {message.role === "assistant" && !message.error && (
                        <div className="mt-4 space-y-3 border-t border-border pt-3">
                          <div className="flex items-center gap-2.5 rounded-md border border-zinc-200/90 bg-white p-2.5 shadow-2xs">
                            <img src="/assets/ata/use_got_it.png" alt="Got it" className="size-11 object-contain shrink-0" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-zinc-950">Got it! That's a great understanding!</p>
                              <p className="text-[11px] text-zinc-500">Ata đồng hành cùng bạn qua 3 bước cốt lõi:</p>
                            </div>
                          </div>
                          <ol className="list-decimal space-y-1 pl-5">
                            <li>Đọc kỹ yêu cầu và gạch chân từ khóa.</li>
                            <li>Áp dụng kiến thức nền vào từng phần nhỏ.</li>
                            <li>Kiểm tra lại kết quả bằng một cách khác.</li>
                          </ol>
                          <div className="rounded-md bg-zinc-950 px-4 py-3 font-mono text-sm text-zinc-100">Kết quả = Kiến thức nền + Thực hành có phản hồi</div>
                          <div className="mt-3 pt-2.5 border-t border-zinc-200/60 flex items-center justify-between text-xs text-zinc-600">
                            <span className="flex items-center gap-1.5 font-medium">
                              <img src="/assets/ata/ata_explaining.png" alt="Explaining" className="size-5 object-contain" />
                              Giải thích từng bước bởi Ata (Adaptive Tutoring Agent)
                            </span>
                            <span className="text-[11px] text-zinc-400">Different Learners. Same Goal.</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {message.role === "assistant" && (
                      <div className="mt-2 flex items-center gap-1">
                        {message.error ? (
                          <Button type="button" variant="ghost" onClick={() => retry(message.id)} className="h-8 rounded-md px-2 text-xs font-semibold text-red-700 hover:bg-red-50 hover:text-red-900"><RefreshCw size={13} /> Thử lại</Button>
                        ) : (
                          <>
                            <Button type="button" variant="ghost" size="icon" onClick={() => navigator.clipboard?.writeText(message.content)} className="size-8 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950" aria-label="Sao chép câu trả lời"><Copy size={14} /></Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => retry(message.id)} className="size-8 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950" aria-label="Tạo lại câu trả lời"><RefreshCw size={14} /></Button>
                            <span className="mx-1 h-4 w-px bg-border" />
                            <Button type="button" variant="ghost" size="icon" onClick={() => setFeedback(current => ({ ...current, [message.id]: "up" }))} className={`size-8 rounded-md transition-colors ${feedback[message.id] === "up" ? "bg-zinc-900 text-white hover:bg-zinc-800" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"}`} aria-label="Câu trả lời hữu ích"><ThumbsUp size={14} /></Button>
                            <Button type="button" variant="ghost" size="icon" onClick={() => setFeedback(current => ({ ...current, [message.id]: "down" }))} className={`size-8 rounded-md transition-colors ${feedback[message.id] === "down" ? "bg-zinc-900 text-white hover:bg-zinc-800" : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"}`} aria-label="Câu trả lời chưa hữu ích"><ThumbsDown size={14} /></Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {message.role === "user" && <span className="hidden size-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 text-xs font-bold text-white sm:flex">NA</span>}
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-3" aria-live="polite">
                  <img
                    src="/assets/ata/ata_thinking.png"
                    alt="Ata Thinking"
                    className="size-9 shrink-0 rounded-md border border-zinc-200 bg-zinc-50 p-0.5 object-contain"
                  />
                  <div className="flex items-center gap-2 rounded-lg rounded-tl-xs border border-border bg-zinc-50 px-4 py-3">
                    <span className="text-xs font-semibold text-zinc-700">Ata đang suy nghĩ</span>
                    <div className="flex items-center gap-1 ml-1">
                      <span className="size-1.5 animate-pulse rounded-full bg-zinc-950" />
                      <span className="size-1.5 animate-pulse rounded-full bg-zinc-950 [animation-delay:150ms]" />
                      <span className="size-1.5 animate-pulse rounded-full bg-zinc-950 [animation-delay:300ms]" />
                    </div>
                    <span className="sr-only">ATA AI đang trả lời</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </ScrollArea>

        <div className="shrink-0 border-t border-border bg-white px-3 py-3 sm:px-6 sm:py-4">
          <div className="mx-auto max-w-3xl">
            {attachment && (
              <div className="mb-2 inline-flex items-center gap-2 rounded-md bg-zinc-100 border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-900">
                <FileText size={13} /> {attachment}
                <Button type="button" variant="ghost" size="icon" onClick={() => setAttachment("")} className="size-5 rounded-md text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950" aria-label="Xóa tệp đính kèm"><X size={12} /></Button>
              </div>
            )}
            <div className="flex items-end gap-2 rounded-md border border-border bg-white p-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-zinc-950/10">
              <Input id="chat-file-input" type="file" className="hidden" onChange={event => setAttachment(event.target.files?.[0]?.name ?? "")} aria-label="Chọn tệp đính kèm" />
              <Button type="button" variant="ghost" size="icon" onClick={() => document.getElementById("chat-file-input")?.click()} className="size-9 shrink-0 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950" aria-label="Đính kèm tệp"><Paperclip size={17} /></Button>
              <Textarea
                value={input}
                onChange={event => setInput(event.target.value)}
                onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
                placeholder="Nhập câu hỏi của bạn cho Ata..."
                className="max-h-32 min-h-10 resize-none border-0 bg-transparent px-1 py-2 text-base shadow-none focus-visible:ring-0"
                aria-label="Tin nhắn cho ATA AI"
              />
              <Button type="button" size="icon" onClick={() => send()} disabled={!input.trim() || typing} className="size-9 shrink-0 rounded-md shadow-none hover:bg-primary/90 hover:text-white" aria-label="Gửi tin nhắn"><Send size={16} /></Button>
            </div>
            <p className="mt-2 hidden text-center text-[11px] text-muted-foreground sm:block">Enter để gửi · Shift + Enter để xuống dòng · ATA AI đồng hành và có thể mắc lỗi, hãy kiểm tra lại thông tin quan trọng</p>
          </div>
        </div>
      </section>

      <aside className="hidden h-full min-h-0 overflow-y-auto border-l border-border bg-zinc-50/70 p-5 xl:block">
        {/* Ata Companion Card */}
        {(() => {
          const currentPose = companionPosesList.find(p => p.id === activePoseId) || companionPosesList[0];
          return (
            <div className="mb-5 rounded-md border border-zinc-200 bg-white p-3.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Gia sư đồng hành</span>
                <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-900">{currentPose.badge}</span>
              </div>
              <div className="mt-2.5 overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 p-2 flex items-center justify-center min-h-[140px]">
                <img
                  src={currentPose.img}
                  alt={currentPose.name}
                  className="max-h-32 w-auto object-contain transition-all duration-300"
                />
              </div>
              <div className="mt-3">
                <p className="text-xs font-bold text-zinc-900 leading-snug">{currentPose.name}</p>
                <p className="mt-1 text-[11px] text-zinc-600 leading-relaxed">{currentPose.description}</p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => send(currentPose.prompt)}
                  className="mt-2.5 h-8 w-full justify-center rounded-md border-zinc-200 bg-zinc-50 px-2 text-[11px] font-semibold text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950"
                >
                  Nhờ Ata: {currentPose.label} <ArrowRight size={11} className="ml-1" />
                </Button>
              </div>

              <div className="mt-3.5 pt-3 border-t border-zinc-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Biểu cảm & Tư thế của Ata:</p>
                <div className="mt-2 grid grid-cols-6 gap-1">
                  {companionPosesList.map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActivePoseId(item.id)}
                      title={`Ata ${item.name}: ${item.label}`}
                      className={`group relative flex flex-col items-center justify-center rounded-md border p-1 transition-all ${
                        activePoseId === item.id
                          ? "border-zinc-900 bg-zinc-100 shadow-2xs ring-1 ring-zinc-900"
                          : "border-zinc-200 bg-zinc-50 hover:border-zinc-400 hover:bg-zinc-100"
                      }`}
                    >
                      <img src={item.img} alt={item.name} className="size-6 object-contain group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        <div className="flex items-center gap-2">
          <Link2 size={17} className="text-primary" />
          <p className="text-sm font-bold">Nguồn tham khảo</p>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">Tài liệu liên quan giúp bạn kiểm chứng và học sâu hơn.</p>
        <div className="mt-4 space-y-2.5">
          {[
            { title: "Ngữ pháp tiếng Anh THPT", source: "Thư viện ATA · Trang 18–24", icon: FileText },
            { title: "Chiến lược tự học hiệu quả", source: "Cẩm nang học tập · 8 phút đọc", icon: Lightbulb },
            { title: "Bài tập luyện tập liên quan", source: "12 câu · Có đáp án", icon: Clipboard },
          ].map(({ title, source, icon: Icon }, index) => (
            <Button key={title} type="button" variant="ghost" className="group h-auto w-full items-start justify-start whitespace-normal rounded-md border border-border bg-white p-2.5 text-left transition-all hover:border-zinc-400 hover:bg-zinc-50 hover:shadow-xs">
              <span className="mr-2.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-primary transition-colors group-hover:bg-zinc-200 group-hover:text-zinc-950"><Icon size={15} /></span>
              <span>
                <span className="block text-xs font-bold leading-5 text-foreground group-hover:text-zinc-950 transition-colors"><span className="mr-1 text-primary">[{index + 1}]</span>{title}</span>
                <span className="mt-0.5 block text-[11px] font-normal leading-4 text-muted-foreground group-hover:text-zinc-700 transition-colors">{source}</span>
              </span>
            </Button>
          ))}
        </div>
        <div className="mt-5 rounded-md border border-zinc-200 bg-zinc-50 p-3.5">
          <p className="text-xs font-bold text-zinc-900">Câu hỏi liên quan</p>
          <div className="mt-2.5 space-y-1.5">
            {["Cho mình một ví dụ cụ thể", "Tạo bài tập tương tự", "Giải thích ngắn gọn hơn"].map(question => (
              <Button key={question} type="button" variant="ghost" onClick={() => send(question)} className="h-auto w-full justify-between whitespace-normal rounded-md bg-white border border-zinc-200/80 px-3 py-2 text-left text-xs font-semibold text-zinc-900 transition-all hover:bg-zinc-100 hover:text-zinc-950 hover:shadow-xs">
                {question}<ChevronRight size={13} className="shrink-0 text-zinc-500" />
              </Button>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}

const detectDocumentPages = async (file: File): Promise<number> => {
  const isPdf = file.name.toLowerCase().endsWith(".pdf");
  if (!isPdf) {
    const estimated = Math.max(1, Math.min(150, Math.round(file.size / (1024 * 32)) || 8));
    return estimated;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = new TextDecoder("latin1").decode(reader.result as ArrayBuffer);
        const countMatch = text.match(/\/Type\s*\/Pages[^>]*\/Count\s+(\d+)/);
        if (countMatch && countMatch[1]) {
          const parsed = parseInt(countMatch[1], 10);
          if (parsed > 0) return resolve(parsed);
        }
        const pageMatches = text.match(/\/Type\s*\/Page\b/g);
        if (pageMatches && pageMatches.length > 0) {
          return resolve(pageMatches.length);
        }
      } catch {
        // Fallback below
      }
      const fallback = Math.max(1, Math.min(120, Math.round(file.size / (1024 * 40)) || 12));
      resolve(fallback);
    };
    reader.onerror = () => {
      resolve(Math.max(1, Math.round(file.size / (1024 * 40)) || 8));
    };
    reader.readAsArrayBuffer(file);
  });
};

function ResourcesScreen({
  openChat,
  resourceList,
  setResourceList,
}: {
  openChat: (prompt: string) => void;
  resourceList: LibraryResource[];
  setResourceList: React.Dispatch<React.SetStateAction<LibraryResource[]>>;
}) {
  const [filter, setFilter] = useState<ResourceType>("Tất cả");
  const [search, setSearch] = useState("");

  // Upload modal states
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadType, setUploadType] = useState<"Tài liệu" | "Bài tập" | "Lộ trình">("Tài liệu");
  const [uploadPages, setUploadPages] = useState<number>(10);
  const [uploadDesc, setUploadDesc] = useState("");
  const [isDetectingPages, setIsDetectingPages] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedSuccessDoc, setUploadedSuccessDoc] = useState<LibraryResource | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Document viewer modal states
  const [activeViewerDoc, setActiveViewerDoc] = useState<LibraryResource | null>(null);
  const [viewerPage, setViewerPage] = useState(1);
  const [viewerZoom, setViewerZoom] = useState(100);
  const [viewerMode, setViewerMode] = useState<"reader" | "native">("reader");

  // Edit document modal states
  const [editingDoc, setEditingDoc] = useState<LibraryResource | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editType, setEditType] = useState<"Tài liệu" | "Bài tập" | "Lộ trình">("Tài liệu");
  const [editPages, setEditPages] = useState<number>(10);
  const [editDesc, setEditDesc] = useState("");
  const [editNotes, setEditNotes] = useState("");

  // Delete document states
  const [docToDelete, setDocToDelete] = useState<LibraryResource | null>(null);
  const [deleteToast, setDeleteToast] = useState<string | null>(null);

  useEffect(() => {
    if (!deleteToast) return;
    const timer = setTimeout(() => setDeleteToast(null), 3500);
    return () => clearTimeout(timer);
  }, [deleteToast]);

  const filtered = resourceList.filter(resource =>
    (filter === "Tất cả" || resource.type === filter) &&
    `${resource.title} ${resource.description}`.toLocaleLowerCase("vi-VN").includes(search.toLocaleLowerCase("vi-VN"))
  );

  const resetUploadModal = () => {
    setUploadFile(null);
    setUploadTitle("");
    setUploadPages(10);
    setUploadDesc("");
    setIsUploading(false);
    setUploadProgress(0);
    setUploadedSuccessDoc(null);
    setIsDragOver(false);
  };

  const handleFilePicked = async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext || "")) {
      alert("Vui lòng chọn tệp có định dạng .pdf, .doc hoặc .docx");
      return;
    }
    setUploadFile(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    setUploadTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    setUploadDesc(`Tài liệu học tập tải lên từ tệp ${file.name}`);
    setIsDetectingPages(true);
    const pages = await detectDocumentPages(file);
    setUploadPages(pages);
    setIsDetectingPages(false);
  };

  const handleUploadSubmit = () => {
    if (!uploadFile) return;
    setIsUploading(true);
    setUploadProgress(20);

    setTimeout(() => setUploadProgress(65), 300);
    setTimeout(() => {
      setUploadProgress(100);
      const ext = uploadFile.name.split(".").pop()?.toLowerCase() as "pdf" | "doc" | "docx";
      const fileUrl = URL.createObjectURL(uploadFile);
      const newDoc: LibraryResource = {
        id: `user-${Date.now()}`,
        type: uploadType,
        icon: ext === "pdf" ? FileText : BookOpen,
        title: uploadTitle.trim() || uploadFile.name,
        description: uploadDesc.trim() || "Tài liệu học tập do bạn tải lên.",
        meta: `${ext.toUpperCase()} · ${uploadPages} trang · Vừa tải lên`,
        pages: uploadPages,
        tone: "bg-zinc-100 text-zinc-900",
        fileUrl,
        fileName: uploadFile.name,
        fileSize: uploadFile.size > 1024 * 1024
          ? `${(uploadFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.max(1, Math.round(uploadFile.size / 1024))} KB`,
        fileFormat: ext,
        isUserUploaded: true,
        uploadedAt: "Vừa tải lên",
      };

      setResourceList(prev => [newDoc, ...prev]);
      setUploadedSuccessDoc(newDoc);
      setIsUploading(false);
    }, 850);
  };

  const openViewer = (doc: LibraryResource) => {
    setActiveViewerDoc(doc);
    setViewerPage(1);
    setViewerZoom(100);
    setViewerMode(doc.fileUrl && doc.fileFormat === "pdf" ? "native" : "reader");
  };

  const handleDownload = (doc: LibraryResource) => {
    if (doc.fileUrl) {
      const a = document.createElement("a");
      a.href = doc.fileUrl;
      a.download = doc.fileName || `${doc.title}.${doc.fileFormat || "pdf"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      const blob = new Blob(
        [
          `# ${doc.title}\n\nLoại: ${doc.type}\nSố trang: ${doc.pages} trang\n\n${doc.description}\n\n---\nATA AI Study Notes · Adaptive Tutoring Agent\nChúc bạn học tập hiệu quả!`
        ],
        { type: "text/markdown;charset=utf-8" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${doc.title}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const openEditModal = (doc: LibraryResource) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditType(doc.type);
    setEditPages(doc.pages);
    setEditDesc(doc.description);
    setEditNotes(doc.notes || "");
  };

  const handleSaveEdit = () => {
    if (!editingDoc) return;
    const updated: LibraryResource = {
      ...editingDoc,
      title: editTitle.trim() || editingDoc.title,
      type: editType,
      pages: editPages,
      description: editDesc.trim(),
      notes: editNotes.trim(),
      meta: `${editingDoc.fileFormat ? editingDoc.fileFormat.toUpperCase() : "PDF"} · ${editPages} trang · Đã chỉnh sửa`,
    };

    setResourceList(prev => prev.map(item => item.id === editingDoc.id ? updated : item));
    if (activeViewerDoc && activeViewerDoc.id === editingDoc.id) {
      setActiveViewerDoc(updated);
    }
    setEditingDoc(null);
  };

  const promptDeleteDoc = (doc: LibraryResource) => {
    setDocToDelete(doc);
  };

  const confirmDeleteDoc = () => {
    if (!docToDelete) return;
    const removedTitle = docToDelete.title;
    const id = docToDelete.id;
    setResourceList(prev => prev.filter(item => item.id !== id));
    if (activeViewerDoc && activeViewerDoc.id === id) {
      setActiveViewerDoc(null);
    }
    if (editingDoc && editingDoc.id === id) {
      setEditingDoc(null);
    }
    setDocToDelete(null);
    setDeleteToast(`Đã xóa tài liệu "${removedTitle}" khỏi thư viện.`);
  };

  const handleRestoreDefaults = () => {
    setResourceList(defaultResources);
    setDeleteToast("Đã khôi phục các tài liệu mặc định của thư viện.");
  };

  return (
    <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      {/* Page Title & Action Bar */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <PageTitle
          eyebrow="Thư viện học tập"
          title="Tìm tài liệu phù hợp với mục tiêu của bạn"
          description="Tài liệu, bài tập và giáo trình đã được chọn lọc để bạn học hiệu quả hơn."
        />
        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:w-auto lg:shrink-0">
          <div className="relative w-full sm:w-72">
            <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Tìm tài liệu, chủ đề..."
              className="h-10 rounded-md bg-white pl-10 text-sm"
              aria-label="Tìm kiếm trong thư viện"
            />
          </div>
          <Button
            type="button"
            onClick={() => {
              resetUploadModal();
              setIsUploadOpen(true);
            }}
            className="h-10 shrink-0 gap-2 rounded-md px-4 font-semibold shadow-xs"
          >
            <UploadCloud size={17} />
            <span>Tải lên tài liệu</span>
          </Button>
        </div>
      </div>

      {/* Filter and stats */}
      <div className="mt-6 flex flex-col gap-3 border-b border-border pb-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {(["Tất cả", "Tài liệu", "Bài tập", "Lộ trình"] as ResourceType[]).map(item => (
            <Button
              key={item}
              type="button"
              variant={filter === item ? "default" : "outline"}
              onClick={() => setFilter(item)}
              className="h-8 shrink-0 rounded-md px-3 text-xs font-semibold shadow-none hover:bg-zinc-100 hover:text-zinc-950"
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {resourceList.length < defaultResources.length && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRestoreDefaults}
              className="h-8 gap-1.5 rounded-md px-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
            >
              <RefreshCw size={12} /> Khôi phục mẫu
            </Button>
          )}
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filtered.length}</span> kết quả phù hợp
          </p>
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid gap-5 py-6 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((item) => {
          const { id, icon: Icon, type, title, description, meta, pages, tone, isUserUploaded, fileFormat } = item;
          return (
            <article
              key={id}
              className={`group flex min-h-64 flex-col rounded-lg border bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-xs ${isUserUploaded ? "border-zinc-900/40 ring-1 ring-zinc-900/10" : "border-border hover:border-zinc-400"}`}
            >
              <div className="flex items-start justify-between">
                <span className={`flex size-10 items-center justify-center rounded-md ${tone}`}>
                  <Icon size={19} />
                </span>
                <div className="flex items-center gap-1.5">
                  {isUserUploaded && (
                    <span className="rounded-md border border-zinc-200 bg-zinc-100 px-2.5 py-0.5 text-[11px] font-bold text-zinc-900">
                      Của bạn
                    </span>
                  )}
                  <span className="rounded-md bg-zinc-100 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-700">
                    {type}
                  </span>
                </div>
              </div>

              <div role="heading" aria-level={2} className="mt-4 text-base font-bold leading-6 text-foreground group-hover:text-zinc-950 transition-colors">
                {title}
              </div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground group-hover:text-zinc-800 transition-colors line-clamp-2">
                {description}
              </p>

              {/* Number of Pages Tag */}
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                  <FileText size={13} className="text-primary" />
                  {pages} trang
                </span>
                {fileFormat && (
                  <span className="rounded-md bg-zinc-100 border border-zinc-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-800">
                    {fileFormat}
                  </span>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs font-medium text-muted-foreground">{meta}</span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openViewer(item)}
                    className="h-8 gap-1.5 rounded-md px-2.5 text-xs font-semibold text-zinc-700 hover:border-zinc-400 hover:bg-zinc-100 hover:text-zinc-950"
                  >
                    <Eye size={13} className="text-primary" /> Xem
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(item)}
                    className="size-8 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                    title="Chỉnh sửa tài liệu"
                    aria-label="Chỉnh sửa tài liệu"
                  >
                    <Pencil size={13} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => promptDeleteDoc(item)}
                    className="size-8 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-destructive"
                    title="Xóa tài liệu"
                    aria-label={`Xóa tài liệu ${title}`}
                  >
                    <Trash2 size={13} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => openChat(`Giúp mình học và tóm tắt tài liệu: ${title}`)}
                    className="h-8 rounded-md px-2 text-xs font-semibold text-primary hover:bg-secondary hover:text-zinc-950"
                  >
                    Hỏi AI <ArrowRight size={13} />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center rounded-lg border border-dashed border-border bg-white py-16 text-center">
          <FolderOpen size={36} className="text-zinc-300" />
          <p className="mt-3 text-base font-bold">Chưa tìm thấy tài liệu phù hợp</p>
          <p className="mt-1 text-sm text-muted-foreground">Thư viện đang trống hoặc không có tài liệu nào khớp với từ khóa.</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <Button
              type="button"
              onClick={() => {
                resetUploadModal();
                setIsUploadOpen(true);
              }}
              className="gap-2 rounded-md text-sm font-semibold shadow-none"
            >
              <UploadCloud size={16} /> Tải lên tài liệu ngay
            </Button>
            {resourceList.length < defaultResources.length && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRestoreDefaults}
                className="gap-2 rounded-md text-sm font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-300"
              >
                <RefreshCw size={15} /> Khôi phục tài liệu mẫu
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      <Dialog open={isUploadOpen} onOpenChange={open => { if (!open) resetUploadModal(); setIsUploadOpen(open); }}>
        <DialogContent className="max-w-lg p-6 rounded-lg">
          <DialogHeader className="text-left">
            <div className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                <UploadCloud size={20} />
              </span>
              <div>
                <DialogTitle className="text-lg font-bold">Tải lên tài liệu học tập</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Hỗ trợ định dạng PDF (.pdf) hoặc Word (.doc, .docx)
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {uploadedSuccessDoc ? (
            <div className="py-4 text-center space-y-4">
              <span className="inline-flex size-14 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900 border border-zinc-200">
                <CheckCircle2 size={30} />
              </span>
              <div>
                <p className="text-lg font-bold text-zinc-900">Tải lên tài liệu thành công!</p>
                <p className="mt-1 text-sm text-muted-foreground">Tài liệu đã được phân loại và sẵn sàng trong thư viện của bạn.</p>
              </div>
              <div className="rounded-md border border-border bg-zinc-50 p-4 text-left">
                <p className="font-bold text-sm text-foreground">{uploadedSuccessDoc.title}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    <FileText size={13} /> {uploadedSuccessDoc.pages} trang
                  </span>
                  <span>·</span>
                  <span>Định dạng: {uploadedSuccessDoc.fileFormat?.toUpperCase()}</span>
                  <span>·</span>
                  <span>{uploadedSuccessDoc.fileSize}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setIsUploadOpen(false);
                    openViewer(uploadedSuccessDoc);
                  }}
                  className="flex-1 gap-2 rounded-md font-semibold shadow-none"
                >
                  <Eye size={16} /> Xem tài liệu ngay
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsUploadOpen(false)}
                  className="rounded-md hover:bg-zinc-100 hover:text-zinc-950"
                >
                  Về thư viện
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={event => {
                  const file = event.target.files?.[0];
                  if (file) handleFilePicked(file);
                }}
                className="hidden"
                id="resource-file-upload"
              />

              {!uploadFile ? (
                <div
                  onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={e => {
                    e.preventDefault();
                    setIsDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    if (file) handleFilePicked(file);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-7 text-center transition-all ${isDragOver ? "border-primary bg-secondary/40" : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"}`}
                >
                  <span className="flex size-11 items-center justify-center rounded-md bg-zinc-100 text-zinc-900 transition-colors group-hover:bg-zinc-200">
                    <FileUp size={22} />
                  </span>
                  <p className="mt-3 text-sm font-bold text-foreground group-hover:text-zinc-950 transition-colors">Kéo thả tệp vào đây, hoặc nhấn để duyệt</p>
                  <p className="mt-1 text-xs text-muted-foreground group-hover:text-zinc-700 transition-colors">Chấp nhận tệp .PDF, .DOC, .DOCX (tối đa 50MB)</p>
                  <Button type="button" variant="outline" size="sm" className="mt-4 rounded-md text-xs font-semibold hover:bg-zinc-100 hover:text-zinc-950">
                    Chọn tệp từ thiết bị
                  </Button>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {/* Selected file preview */}
                  <div className="flex items-center justify-between rounded-md border border-border bg-zinc-50 p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-md font-bold text-xs bg-zinc-100 text-zinc-900 border border-zinc-200">
                        {uploadFile.name.split(".").pop()?.toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">{uploadFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadFile.size / (1024 * 1024)).toFixed(1)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadFile(null)}
                      className="text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
                    >
                      Đổi tệp
                    </Button>
                  </div>

                  {/* Detected Page Count Callout */}
                  <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-900">
                    <div className="flex items-center gap-2">
                      <FileCheck size={16} className="text-primary shrink-0" />
                      <span>
                        {isDetectingPages ? "Đang quét trang tài liệu..." : "Số trang tự động nhận diện:"}
                      </span>
                    </div>
                    <span className="rounded-md bg-white border border-zinc-200 px-2.5 py-1 text-xs font-bold text-zinc-900 shadow-xs">
                      {isDetectingPages ? "..." : `${uploadPages} trang`}
                    </span>
                  </div>

                  {/* Form fields */}
                  <div>
                    <label className="text-xs font-bold text-foreground">Tiêu đề tài liệu</label>
                    <Input
                      value={uploadTitle}
                      onChange={event => setUploadTitle(event.target.value)}
                      placeholder="Nhập tiêu đề tài liệu..."
                      className="mt-1 h-10 rounded-md bg-white text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-foreground">Danh mục</label>
                      <select
                        value={uploadType}
                        onChange={e => setUploadType(e.target.value as "Tài liệu" | "Bài tập" | "Lộ trình")}
                        className="mt-1 flex h-10 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary"
                      >
                        <option value="Tài liệu">Tài liệu</option>
                        <option value="Bài tập">Bài tập</option>
                        <option value="Lộ trình">Lộ trình</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-foreground">Số trang</label>
                      <Input
                        type="number"
                        min={1}
                        max={999}
                        value={uploadPages}
                        onChange={event => setUploadPages(Math.max(1, parseInt(event.target.value, 10) || 1))}
                        className="mt-1 h-10 rounded-md bg-white text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-foreground">Mô tả ngắn</label>
                    <Input
                      value={uploadDesc}
                      onChange={event => setUploadDesc(event.target.value)}
                      placeholder="Ghi chú nội dung trọng tâm của tài liệu..."
                      className="mt-1 h-10 rounded-md bg-white text-sm"
                    />
                  </div>

                  {isUploading && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                        <span>Đang xử lý tải lên...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded bg-zinc-200">
                        <div
                          className="h-full bg-zinc-900 transition-all duration-300 rounded"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      onClick={handleUploadSubmit}
                      disabled={isUploading || isDetectingPages || !uploadTitle.trim()}
                      className="flex-1 gap-2 rounded-md font-semibold shadow-none"
                    >
                      <UploadCloud size={16} />
                      {isUploading ? "Đang lưu..." : "Xác nhận tải lên"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsUploadOpen(false)}
                      disabled={isUploading}
                      className="rounded-md hover:bg-zinc-100 hover:text-zinc-950"
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Document Viewer Modal */}
      {activeViewerDoc && (
        <Dialog open={Boolean(activeViewerDoc)} onOpenChange={open => { if (!open) setActiveViewerDoc(null); }}>
          <DialogContent className="max-w-[95vw] sm:max-w-4xl h-[90vh] p-0 rounded-lg flex flex-col overflow-hidden bg-zinc-50 gap-0">
            {/* Viewer Header */}
            <div className="flex shrink-0 items-center justify-between border-b border-border bg-white px-4 py-3 sm:px-6">
              <div className="flex items-center gap-2.5 min-w-0 pr-4">
                <span className={`flex size-9 shrink-0 items-center justify-center rounded-md ${activeViewerDoc.tone}`}>
                  <FileText size={18} />
                </span>
                <div className="min-w-0">
                  <DialogTitle className="truncate text-base font-bold text-foreground">
                    {activeViewerDoc.title}
                  </DialogTitle>
                  <DialogDescription className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-primary">{activeViewerDoc.type}</span>
                    <span>·</span>
                    <span>Trang {viewerPage} / {activeViewerDoc.pages}</span>
                    {activeViewerDoc.isUserUploaded && (
                      <>
                        <span>·</span>
                        <span className="rounded-md bg-zinc-100 border border-zinc-200 px-1.5 py-0.2 text-[10px] font-bold text-zinc-900">Của bạn</span>
                      </>
                    )}
                  </DialogDescription>
                </div>
              </div>

              {/* Viewer Controls */}
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                {activeViewerDoc.fileUrl && activeViewerDoc.fileFormat === "pdf" && (
                  <div className="hidden sm:flex rounded-md bg-zinc-100 p-0.5 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setViewerMode("reader")}
                      className={`rounded-md px-2.5 py-1 transition-colors ${viewerMode === "reader" ? "bg-white text-zinc-950 font-semibold shadow-xs" : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"}`}
                    >
                      Đọc sách
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewerMode("native")}
                      className={`rounded-md px-2.5 py-1 transition-colors ${viewerMode === "native" ? "bg-white text-zinc-950 font-semibold shadow-xs" : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60"}`}
                    >
                      PDF gốc
                    </button>
                  </div>
                )}

                <div className="hidden md:flex items-center gap-1 rounded-md border border-border bg-white px-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewerZoom(z => Math.max(75, z - 15))}
                    className="size-7 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    aria-label="Thu nhỏ"
                  >
                    <ZoomOut size={14} />
                  </Button>
                  <span className="text-[11px] font-semibold text-zinc-700 px-1">{viewerZoom}%</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewerZoom(z => Math.min(150, z + 15))}
                    className="size-7 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                    aria-label="Phóng to"
                  >
                    <ZoomIn size={14} />
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => openEditModal(activeViewerDoc)}
                  className="h-8 gap-1.5 rounded-md px-2 sm:px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                  title="Chỉnh sửa thông tin tài liệu"
                  aria-label="Chỉnh sửa thông tin tài liệu"
                >
                  <Pencil size={13} />
                  <span className="hidden sm:inline">Chỉnh sửa</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const title = activeViewerDoc.title;
                    setActiveViewerDoc(null);
                    openChat(`Giúp mình giải thích và làm bài tập về tài liệu: ${title}`);
                  }}
                  className="hidden sm:inline-flex h-8 gap-1.5 rounded-md text-xs font-semibold text-primary hover:bg-secondary hover:text-zinc-950"
                >
                  <Bot size={14} /> Hỏi AI
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDownload(activeViewerDoc)}
                  className="size-8 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  aria-label="Tải tài liệu về máy"
                  title="Tải về máy"
                >
                  <Download size={15} />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => promptDeleteDoc(activeViewerDoc)}
                  className="size-8 rounded-md text-zinc-600 hover:bg-zinc-100 hover:text-destructive"
                  aria-label="Xóa tài liệu khỏi thư viện"
                  title="Xóa tài liệu"
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>

            {/* Viewer Content Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 flex justify-center bg-zinc-100/90">
              {viewerMode === "native" && activeViewerDoc.fileUrl ? (
                <iframe
                  src={activeViewerDoc.fileUrl}
                  title={activeViewerDoc.title}
                  className="h-full w-full rounded-md border border-border bg-white shadow-xs"
                />
              ) : (
                /* Reader Paper View */
                <div
                  style={{ transform: `scale(${viewerZoom / 100})`, transformOrigin: "top center" }}
                  className="flex flex-col justify-between w-full max-w-2xl min-h-[640px] rounded-md border border-zinc-200 bg-white p-7 sm:p-10 shadow-xs transition-transform"
                >
                  {/* Paper Header */}
                  <div>
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3 text-xs text-muted-foreground">
                      <span className="font-semibold tracking-wide uppercase text-primary">ATA Academy Library</span>
                      <span>Trang {viewerPage} / {activeViewerDoc.pages}</span>
                    </div>

                    <div className="mt-6">
                      <div className="inline-block rounded-md bg-secondary px-2.5 py-1 text-xs font-bold text-primary">
                        {activeViewerDoc.type} · Phần {viewerPage}
                      </div>
                      <h2 className="mt-3 text-xl font-bold text-zinc-900 leading-snug">
                        {viewerPage === 1 ? activeViewerDoc.title : `${activeViewerDoc.title} — Chuyên đề ${viewerPage}`}
                      </h2>
                      <p className="mt-2 text-sm text-zinc-600 leading-6">
                        {viewerPage === 1
                          ? activeViewerDoc.description
                          : `Nội dung phần thực hành và chuyên đề trọng tâm của trang ${viewerPage}. Áp dụng các quy tắc để giải quyết dạng bài tập tương ứng.`}
                      </p>
                    </div>

                    {/* Educational Formatted Content Block */}
                    <div className="mt-6 space-y-4 text-sm text-zinc-800 leading-7">
                      {/* Personal Study Notes / Summary if edited */}
                      {activeViewerDoc.notes && (
                        <div className="rounded-md border border-zinc-300 bg-zinc-50 p-4">
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-xs uppercase tracking-wide text-zinc-900 flex items-center gap-1.5">
                              <Pencil size={13} className="text-zinc-700" /> Ghi chú học tập của bạn:
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(activeViewerDoc)}
                              className="h-6 text-[11px] font-semibold text-zinc-800 hover:bg-zinc-200 px-1.5"
                            >
                              Sửa ghi chú
                            </Button>
                          </div>
                          <p className="mt-2 text-xs leading-6 text-zinc-800 whitespace-pre-wrap">
                            {activeViewerDoc.notes}
                          </p>
                        </div>
                      )}

                      <div className="rounded-md border border-zinc-200 bg-zinc-50 p-4">
                        <p className="font-bold text-xs uppercase tracking-wide text-zinc-900 flex items-center gap-1.5">
                          <Sparkles size={14} className="text-primary" /> Mục tiêu cần đạt trong phần này:
                        </p>
                        <ul className="mt-2 list-disc pl-5 space-y-1 text-xs text-zinc-700">
                          <li>Nắm vững định nghĩa, cấu trúc nền tảng và nhận biết dấu hiệu bài thi.</li>
                          <li>Tránh 3 bẫy phổ biến thường gặp ở mức độ điểm trung bình và nâng cao.</li>
                          <li>Thực hiện phân tích ngữ cảnh để lựa chọn đáp án chính xác nhất.</li>
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-sm text-zinc-900">1. Kiến thức cốt lõi & Phương pháp áp dụng</p>
                        <p className="text-xs leading-6 text-zinc-600">
                          Trong các kỳ thi chuẩn hóa, việc làm chủ từ khóa và cấu trúc logic đóng vai trò quyết định. Khi tiếp cận bất kỳ câu hỏi nào trong chuyên đề này, bạn hãy tuần tự làm theo 3 bước:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                          <div className="rounded-md bg-zinc-50 p-3 border border-zinc-200/80">
                            <span className="font-bold text-xs text-primary">Bước 1:</span>
                            <p className="mt-1 text-[11px] text-zinc-600">Đọc lướt yêu cầu và gạch chân các từ khóa cốt lõi.</p>
                          </div>
                          <div className="rounded-md bg-zinc-50 p-3 border border-zinc-200/80">
                            <span className="font-bold text-xs text-primary">Bước 2:</span>
                            <p className="mt-1 text-[11px] text-zinc-600">Đối chiếu dữ liệu với bảng quy tắc đã được hệ thống.</p>
                          </div>
                          <div className="rounded-md bg-zinc-50 p-3 border border-zinc-200/80">
                            <span className="font-bold text-xs text-primary">Bước 3:</span>
                            <p className="mt-1 text-[11px] text-zinc-600">Kiểm tra lại tính logic và loại trừ các đáp án nhiễu.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2">
                        <p className="font-bold text-sm text-zinc-900">2. Ví dụ minh họa thực tế</p>
                        <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5 font-mono text-xs text-zinc-800">
                          <code>Q: "Analyze the core variables and outline the standard solution strategy."</code>
                          <p className="mt-2 font-sans text-xs text-zinc-600">
                            <strong>Phân tích:</strong> Nhận diện từ khóa "core variables" và xác định hướng triển khai từng bước có giải thích.
                          </p>
                        </div>
                      </div>

                      {/* Ata Study Companion Box */}
                      <div className="rounded-md border border-zinc-200 bg-zinc-50/80 p-3.5 flex items-start gap-3">
                        <img src="/assets/ata/ata_explaining.png" alt="Ata Tutor" className="size-8 object-contain shrink-0" />
                        <div className="text-xs">
                          <p className="font-bold text-zinc-900">Ata Study Tip:</p>
                          <p className="mt-0.5 text-zinc-600 leading-5">
                            Gặp khó khăn ở phần nào trong bài đọc này? Hãy mở Trợ lý ATA để được giải thích chi tiết từng bước và nhận thêm 3 bài tập tự luyện tương đương.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Paper Footer */}
                  <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Tài liệu phục vụ học tập và nghiên cứu cá nhân</span>
                    <span className="font-semibold text-zinc-700">Trang {viewerPage}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Viewer Bottom Navigation */}
            <div className="flex shrink-0 items-center justify-between border-t border-border bg-white px-4 py-3 sm:px-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={viewerPage <= 1}
                onClick={() => setViewerPage(p => Math.max(1, p - 1))}
                className="gap-1.5 rounded-md font-semibold text-xs text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
              >
                <ChevronLeft size={15} /> Trang trước
              </Button>

              <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700">
                <span>Trang</span>
                <input
                  type="number"
                  min={1}
                  max={activeViewerDoc.pages}
                  value={viewerPage}
                  onChange={e => {
                    const p = parseInt(e.target.value, 10);
                    if (p >= 1 && p <= activeViewerDoc.pages) setViewerPage(p);
                  }}
                  className="w-12 text-center rounded-md border border-border bg-zinc-50 py-1 text-xs font-bold text-foreground"
                />
                <span>/ {activeViewerDoc.pages}</span>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={viewerPage >= activeViewerDoc.pages}
                onClick={() => setViewerPage(p => Math.min(activeViewerDoc.pages, p + 1))}
                className="gap-1.5 rounded-md font-semibold text-xs text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
              >
                Trang sau <ChevronRight size={15} />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Document Modal */}
      {editingDoc && (
        <Dialog open={Boolean(editingDoc)} onOpenChange={open => { if (!open) setEditingDoc(null); }}>
          <DialogContent className="max-w-lg p-6 rounded-lg border border-border bg-white">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-2.5">
                <span className="flex size-10 items-center justify-center rounded-md bg-zinc-100 text-zinc-900">
                  <Pencil size={18} />
                </span>
                <div>
                  <DialogTitle className="text-lg font-bold">Chỉnh sửa thông tin tài liệu</DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground">
                    Cập nhật tiêu đề, danh mục, số trang hoặc ghi chú học tập cá nhân.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-bold text-foreground">Tiêu đề tài liệu</label>
                <Input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  placeholder="Nhập tiêu đề tài liệu..."
                  className="mt-1 h-10 rounded-md bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground">Loại tài liệu</label>
                  <select
                    value={editType}
                    onChange={e => setEditType(e.target.value as "Tài liệu" | "Bài tập" | "Lộ trình")}
                    className="mt-1 h-10 w-full rounded-md border border-border bg-white px-3 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-zinc-950/20"
                  >
                    <option value="Tài liệu">Tài liệu</option>
                    <option value="Bài tập">Bài tập</option>
                    <option value="Lộ trình">Lộ trình</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground">Số trang</label>
                  <Input
                    type="number"
                    min={1}
                    max={9999}
                    value={editPages}
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      setEditPages(isNaN(val) ? 1 : Math.max(1, val));
                    }}
                    className="mt-1 h-10 rounded-md bg-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground">Mô tả ngắn</label>
                <Input
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="Mô tả nội dung tóm tắt..."
                  className="mt-1 h-10 rounded-md bg-white text-sm"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-foreground">Ghi chú & Tóm tắt cá nhân</label>
                  <span className="text-[11px] text-muted-foreground">Hiển thị trong chế độ đọc</span>
                </div>
                <Textarea
                  value={editNotes}
                  onChange={e => setEditNotes(e.target.value)}
                  placeholder="Thêm ghi chú, từ khóa hoặc mẹo học riêng cho tài liệu này..."
                  rows={3}
                  className="mt-1 rounded-md bg-white text-xs leading-5"
                />
              </div>

              <div className="flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-3 text-xs">
                <div className="text-zinc-900">
                  <p className="font-bold">Xóa tài liệu này?</p>
                  <p className="text-[11px] text-zinc-600">
                    {editingDoc.isUserUploaded
                      ? "Tài liệu tải lên sẽ được xóa khỏi thư viện cá nhân của bạn."
                      : "Gỡ bỏ tài liệu này khỏi danh sách hiển thị của thư viện."}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => promptDeleteDoc(editingDoc)}
                  className="h-8 gap-1.5 rounded-md text-xs font-semibold text-destructive hover:bg-zinc-200 hover:text-zinc-950"
                >
                  <Trash2 size={13} /> Xóa
                </Button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={!editTitle.trim()}
                  className="flex-1 gap-2 rounded-md font-semibold shadow-none bg-zinc-950 text-white hover:bg-zinc-800"
                >
                  <Save size={15} /> Lưu thay đổi
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingDoc(null)}
                  className="rounded-md hover:bg-zinc-100 hover:text-zinc-950"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <Dialog open={Boolean(docToDelete)} onOpenChange={open => { if (!open) setDocToDelete(null); }}>
          <DialogContent className="max-w-md p-6 rounded-lg border border-border bg-white">
            <DialogHeader className="text-left">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-md bg-zinc-100 text-zinc-950 ring-4 ring-zinc-100/50">
                  <Trash2 size={20} />
                </span>
                <div>
                  <DialogTitle className="text-base font-bold text-foreground">
                    Xác nhận xóa tài liệu
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                    Hành động này sẽ gỡ tài liệu khỏi thư viện học tập.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="py-3">
              <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3.5">
                <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Tài liệu được chọn:</p>
                <p className="mt-1 text-sm font-bold text-zinc-900 line-clamp-2">{docToDelete.title}</p>
                <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
                  <span className="rounded-md bg-white px-2 py-0.5 font-medium border border-zinc-200">{docToDelete.type}</span>
                  <span>·</span>
                  <span>{docToDelete.pages} trang</span>
                  {docToDelete.isUserUploaded && (
                    <>
                      <span>·</span>
                      <span className="font-semibold text-zinc-800">Tài liệu bạn tải lên</span>
                    </>
                  )}
                </div>
              </div>
              <p className="mt-3 text-xs text-zinc-500 leading-5">
                Bạn có chắc chắn muốn xóa tài liệu này không? Nếu là tài liệu mẫu, bạn có thể bấm &quot;Khôi phục mẫu&quot; bất cứ lúc nào.
              </p>
            </div>

            <DialogFooter className="flex-row gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDocToDelete(null)}
                className="flex-1 sm:flex-initial rounded-md hover:bg-zinc-100 hover:text-zinc-950"
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={confirmDeleteDoc}
                className="flex-1 sm:flex-initial gap-1.5 rounded-md font-semibold shadow-none bg-zinc-950 text-white hover:bg-zinc-800"
              >
                <Trash2 size={14} /> Xóa tài liệu
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Floating Toast Notification */}
      {deleteToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <Trash2 size={15} className="text-zinc-400 shrink-0" />
          <span className="line-clamp-1">{deleteToast}</span>
          <button
            type="button"
            onClick={() => setDeleteToast(null)}
            className="ml-2 rounded-md p-1 text-zinc-400 hover:text-white"
            aria-label="Đóng thông báo"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </main>
  );
}

function ProfileScreen({ openChat }: { openChat?: (prompt: string) => void }) {
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
      <PageTitle eyebrow="Tiến độ học tập" title="Chào Nguyễn An, bạn đang tiến bộ rất tốt" description="Theo dõi mục tiêu, hoạt động gần đây và duy trì nhịp học đều đặn." />
      <div className="mt-8 grid grid-cols-12 gap-5">
        <section className="col-span-12 rounded-lg border border-border bg-white p-4 sm:p-6 lg:col-span-8">
          <SectionHeading title="Mục tiêu tuần này" description="11–17 tháng 8" action={<span className="rounded-md border border-zinc-200 bg-zinc-100 px-3 py-1 text-xs font-bold text-zinc-900">Đúng tiến độ</span>} />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Thời gian học", value: "4 giờ 20 phút", target: "Mục tiêu 5 giờ", icon: Clock3, progress: "w-[86%]", tone: "text-zinc-900 bg-zinc-100" },
              { label: "Bài đã hoàn thành", value: "12 bài", target: "Mục tiêu 15 bài", icon: CheckCircle2, progress: "w-4/5", tone: "text-zinc-900 bg-zinc-100" },
              { label: "Chuỗi học liên tục", value: "7 ngày", target: "Kỷ lục 12 ngày", icon: Trophy, progress: "w-7/12", tone: "text-zinc-900 bg-zinc-100" },
            ].map(({ label, value, target, icon: Icon, progress, tone }) => (
              <div key={label} className="rounded-md border border-border bg-zinc-50/50 p-4">
                <span className={`flex size-9 items-center justify-center rounded-md ${tone}`}><Icon size={17} /></span>
                <p className="mt-4 text-xs font-medium text-muted-foreground">{label}</p>
                <p className="mt-1 text-lg font-bold">{value}</p>
                <div className="mt-3 h-1.5 overflow-hidden rounded-md bg-zinc-200"><div className={`h-full rounded-md bg-zinc-950 ${progress}`} /></div>
                <p className="mt-2 text-[11px] text-muted-foreground">{target}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="col-span-12 rounded-lg border border-border bg-white p-4 sm:p-6 lg:col-span-4">
          <div className="flex items-center gap-4">
            <span className="flex size-14 items-center justify-center rounded-md bg-zinc-950 text-base font-bold text-white">NA</span>
            <div>
              <p className="text-lg font-bold">Nguyễn An</p>
              <p className="mt-1 text-sm text-muted-foreground">Học viên · Lớp 12</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-center"><p className="text-lg font-bold">1.280</p><p className="mt-1 text-[11px] text-muted-foreground">Điểm học tập</p></div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 p-3 text-center"><p className="text-lg font-bold">B1+</p><p className="mt-1 text-[11px] text-muted-foreground">Trình độ hiện tại</p></div>
          </div>
          <Button type="button" variant="outline" className="mt-4 h-10 w-full rounded-md text-sm font-semibold text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950"><Settings size={16} /> Chỉnh sửa hồ sơ</Button>
        </aside>

        <section className="col-span-12 rounded-lg border border-border bg-white p-4 sm:p-6 lg:col-span-8">
          <SectionHeading title="Hoạt động gần đây" description="Những nội dung bạn vừa học" />
          <div className="space-y-1">
            {[
              { title: "Hoàn thành bài luyện đọc hiểu B1", time: "Hôm nay, 10:24", icon: CheckCircle2, tone: "bg-zinc-100 text-zinc-900" },
              { title: "Hỏi ATA AI về thì hiện tại hoàn thành", time: "Hôm qua, 20:15", icon: Bot, tone: "bg-zinc-100 text-zinc-900" },
              { title: "Lưu tài liệu 300 từ vựng học thuật", time: "12 tháng 8, 16:40", icon: BookOpen, tone: "bg-zinc-100 text-zinc-900" },
            ].map(({ title, time, icon: Icon, tone }) => (
              <div key={title} className="group flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-zinc-50 cursor-pointer">
                <span className={`flex size-9 items-center justify-center rounded-md ${tone}`}><Icon size={16} /></span>
                <div className="flex-1"><p className="text-sm font-semibold text-foreground group-hover:text-zinc-950 transition-colors">{title}</p><p className="mt-1 text-xs text-muted-foreground group-hover:text-zinc-700 transition-colors">{time}</p></div>
                <ChevronRight size={16} className="text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-zinc-950" />
              </div>
            ))}
          </div>
        </section>

        <aside className="col-span-12 rounded-lg border border-border bg-white p-5 shadow-2xs lg:col-span-4 flex flex-col justify-between">
          <div>
            <div className="overflow-hidden rounded-md border border-zinc-100 bg-zinc-50 p-2 flex items-center justify-center">
              <img
                src="/assets/ata/use_level_up.png"
                alt="Level Up! You're making real progress!"
                className="max-h-40 w-auto object-contain"
              />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex size-6 items-center justify-center rounded-md bg-zinc-950 text-white text-xs font-bold">
                ★
              </span>
              <p className="text-sm font-bold text-zinc-900">Mốc thành tích tuần</p>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Ata ghi nhận bạn đã hoàn thành 80% chỉ tiêu tuần! Chỉ cần thêm 20 phút luyện nghe hôm nay để mở khóa huy hiệu tuần mới.
            </p>
            <div className="mt-4 rounded-md border border-zinc-200 bg-zinc-50 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-700">Mục tiêu: B1+ Hoàn thành</span>
                <span className="font-bold text-zinc-950">80%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-md bg-zinc-200">
                <div className="h-full w-4/5 rounded-md bg-zinc-950" />
              </div>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => openChat?.("Ata ơi, hôm nay hãy cho mình một bài kiểm tra ngắn để thăng cấp nhé!")}
            className="mt-5 h-10 w-full rounded-md bg-zinc-950 text-sm font-semibold text-white shadow-none transition-colors hover:bg-zinc-800"
          >
            Luyện tập cùng Ata <ArrowRight size={15} />
          </Button>
        </aside>
      </div>
    </main>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(AUTH_STORAGE_KEY) === "true" || sessionStorage.getItem(AUTH_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [view, setView] = useState<View>("home");
  const [chatPrompt, setChatPrompt] = useState("");
  const [resourceList, setResourceList] = useState<LibraryResource[]>(defaultResources);

  const handleLogin = (remember: boolean) => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      (remember ? localStorage : sessionStorage).setItem(AUTH_STORAGE_KEY, "true");
    } catch {
      // Keep the demo session available when browser storage is blocked.
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // Logging out still succeeds in memory.
    }
    setView("home");
    setIsAuthenticated(false);
  };

  const navigate = (nextView: View) => {
    if (nextView === "chat") setChatPrompt("");
    setView(nextView);
  };

  const openChat = (prompt: string) => {
    setChatPrompt(prompt);
    setView("chat");
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen
        wordmark={<AtaWordmark className="h-8" />}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${view === "chat" ? "h-dvh max-h-dvh overflow-hidden flex flex-col" : ""}`}>
      <AppHeader view={view} setView={navigate} onLogout={handleLogout} />
      {view === "home" && <HomeScreen setView={navigate} askAI={openChat} resources={resourceList} />}
      {view === "chat" && <ChatScreen initialPrompt={chatPrompt} />}
      {view === "resources" && <ResourcesScreen openChat={openChat} resourceList={resourceList} setResourceList={setResourceList} />}
      {view === "profile" && <ProfileScreen openChat={openChat} />}
    </div>
  );
}
