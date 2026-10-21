# Kế hoạch thêm màn hình đăng nhập cho Wapple English

## Mục tiêu

Thêm một màn hình đăng nhập xuất hiện trước dashboard khi người dùng chưa có phiên đăng nhập. Đây là đăng nhập mô phỏng phía trình duyệt, không kết nối backend và không tạo bảo mật thực.

Sau khi đăng nhập thành công, người dùng vào ứng dụng hiện tại. Nút `Đăng xuất` trong sidebar sẽ hoạt động, xóa phiên và đưa người dùng trở lại màn hình login.

## Quyết định sản phẩm đã chốt

- Cơ chế: đăng nhập mô phỏng, không API/Supabase.
- Thông tin hợp lệ:
  - Email phải đúng định dạng cơ bản.
  - Mật khẩu phải có ít nhất 6 ký tự.
  - Không kiểm tra tài khoản cố định; mọi cặp email/mật khẩu đạt validation đều đăng nhập được.
- Form gồm email, mật khẩu, hiện/ẩn mật khẩu, `Ghi nhớ đăng nhập`, liên kết `Quên mật khẩu?` và nút đăng nhập.
- Checkbox `Ghi nhớ đăng nhập` mặc định được chọn.
- Nếu ghi nhớ: lưu phiên trong `localStorage`, còn sau khi bỏ chọn thì chỉ lưu trong `sessionStorage`.
- `Quên mật khẩu?` hiển thị thông báo mô phỏng ngay trong form rằng tính năng cần backend, không điều hướng sang trang khác.
- Không thêm đăng ký tài khoản hoặc đăng nhập Google.
- Hồ sơ trong dashboard tiếp tục hiển thị `Nguyen Van A`; email nhập ở login chỉ dùng để mô phỏng xác thực, không thay đổi dữ liệu hồ sơ hiện có.

## Phạm vi file

### Tạo mới

- `src/app/components/LoginScreen.tsx`
  - Chứa toàn bộ UI, validation và trạng thái cục bộ của form đăng nhập.

### Chỉnh sửa

- `src/app/App.tsx`
  - Thêm trạng thái xác thực.
  - Render `LoginScreen` khi chưa đăng nhập.
  - Lưu/xóa phiên đăng nhập.
  - Gắn hành vi cho nút `Đăng xuất` hiện có.

### Không thay đổi

- Không thay đổi `src/main.tsx`, router, cấu hình Vite, theme hoặc stylesheet toàn cục.
- Không thay đổi dashboard, chatbot, danh sách bài học, dữ liệu bài học hoặc modal hiện có ngoài việc đặt chúng sau cổng đăng nhập.
- Không thêm dependency mới.

## Kiến trúc và luồng dữ liệu

### 1. Trạng thái xác thực trong `App.tsx`

- Khai báo một khóa lưu trữ ổn định, ví dụ `wapple-authenticated`.
- Khởi tạo `isAuthenticated` bằng lazy initializer:
  - Đăng nhập nếu khóa tồn tại với giá trị hợp lệ trong `localStorage` hoặc `sessionStorage`.
  - Nếu không có khóa thì hiển thị login.
- Tạo `handleLogin(remember: boolean)`:
  1. Xóa khóa cũ ở cả hai storage để tránh trạng thái trùng.
  2. Nếu `remember` là `true`, ghi khóa vào `localStorage`.
  3. Nếu `remember` là `false`, ghi khóa vào `sessionStorage`.
  4. Cập nhật `isAuthenticated` thành `true`.
- Tạo `handleLogout()`:
  1. Xóa khóa ở cả `localStorage` và `sessionStorage`.
  2. Đưa view hiện tại về `dashboard` để lần đăng nhập sau bắt đầu ở trang Tổng quan.
  3. Cập nhật `isAuthenticated` thành `false`.
- Trước phần return dashboard hiện tại, nếu chưa đăng nhập thì trả về `LoginScreen`.
- Truyền callback `onLogin` và các phần tử nhận diện thương hiệu hiện có (`WappleLogo`, `WappleWordmark`) xuống login qua props, tránh sao chép SVG hoặc di chuyển logo sang module khác.
- Gắn `onClick={handleLogout}` vào đúng button `Đăng xuất` hiện có.

### 2. API của `LoginScreen`

Component mới nhận các props:

- `onLogin: (remember: boolean) => void`.
- `logo: React.ReactNode`.
- `wordmark: React.ReactNode`.

Component tự quản lý:

- `email`.
- `password`.
- `showPassword`.
- `remember` mặc định `true`.
- Lỗi theo từng field.
- Trạng thái thông báo quên mật khẩu.
- Trạng thái submit ngắn để hiển thị phản hồi trực quan trước khi vào dashboard.

Không truyền hoặc lưu mật khẩu ra ngoài component. Không ghi email/mật khẩu vào storage.

## Thiết kế màn hình

### 1. Bố cục tổng thể

- Màn hình chiếm toàn viewport với nền `background` hiện có.
- Desktop dùng bố cục hai cột:
  - Cột thương hiệu màu xanh/gradient, có logo Wapple, câu chào và các lợi ích ngắn của ứng dụng.
  - Cột form có card đăng nhập rõ ràng, khoảng trắng thoáng và hierarchy mạnh.
- Mobile chuyển thành một cột:
  - Phần branding được rút gọn phía trên.
  - Card form chiếm gần toàn chiều rộng với padding phù hợp.
- Giữ ngôn ngữ thiết kế hiện tại: xanh primary, accent cam, card trắng, bo góc lớn, viền token `border`, typography Nunito/Fredoka và bóng đổ nhẹ.
- Không dùng ảnh ngoài; logo/mascot hiện có là nhận diện chính và phù hợp hơn ảnh stock.

### 2. Nội dung

- Tiêu đề: `Chào mừng trở lại!`
- Mô tả: `Đăng nhập để tiếp tục hành trình học tiếng Anh cùng Wapple.`
- Label và placeholder rõ ràng bằng tiếng Việt:
  - `Email` / `ban@example.com`.
  - `Mật khẩu` / `Nhập mật khẩu của bạn`.
- Checkbox: `Ghi nhớ đăng nhập`.
- Liên kết: `Quên mật khẩu?`.
- CTA chính: `Đăng nhập`.
- Dòng chú thích nhỏ làm rõ đây là bản demo: `Bản demo — bạn có thể dùng bất kỳ email hợp lệ và mật khẩu từ 6 ký tự.`

### 3. Component hệ thống sử dụng

Tận dụng các primitive có sẵn, không tạo bản sao:

- `Input` cho email và password.
- `Button` cho submit, hiện/ẩn password và quên mật khẩu.
- `Label` cho nhãn field và checkbox.
- `Checkbox` cho ghi nhớ đăng nhập.
- `Alert`, `AlertTitle`, `AlertDescription` cho thông báo quên mật khẩu.
- Icon từ `lucide-react`: `Mail`, `LockKeyhole`, `Eye`, `EyeOff`, `LogIn`, `Info`, cùng icon trang trí phù hợp.

Dùng token Tailwind hiện có (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `border-border`, `ring-ring`) và không thêm màu hex mới trong UI login.

## Validation và hành vi form

### 1. Submit

- Dùng phần tử `form` và `onSubmit` để hỗ trợ phím Enter tự nhiên.
- Trước validation, trim email; không trim mật khẩu vì khoảng trắng có thể là dữ liệu người dùng nhập.
- Email:
  - Bắt buộc.
  - Kiểm tra bằng biểu thức định dạng email cơ bản, không cố triển khai đầy đủ RFC.
- Mật khẩu:
  - Bắt buộc.
  - Ít nhất 6 ký tự.
- Lỗi được hiển thị ngay dưới field tương ứng và field có `aria-invalid`/`aria-describedby`.
- Khi người dùng chỉnh field đang lỗi, xóa lỗi field đó để phản hồi nhanh.
- Nếu hợp lệ:
  - Khóa field và CTA trong khoảng chờ mô phỏng ngắn.
  - CTA đổi thành `Đang đăng nhập...` và có trạng thái loading không gây layout shift.
  - Gọi `onLogin(remember)` sau khoảng chờ.
- Không hiển thị lỗi “sai tài khoản/mật khẩu” vì không có tài khoản cố định.

### 2. Hiện/ẩn mật khẩu

- Button icon nằm bên phải field password.
- Chuyển type giữa `password` và `text`.
- Có `aria-label` thay đổi theo trạng thái: `Hiện mật khẩu` / `Ẩn mật khẩu`.
- Không submit form khi bấm button này.

### 3. Ghi nhớ đăng nhập

- Checkbox mặc định bật.
- Có label liên kết bằng `htmlFor`/`id` để nhấn vào chữ cũng thay đổi checkbox.
- Nếu tắt checkbox, reload cùng tab vẫn giữ phiên qua `sessionStorage`; đóng tab/browser sẽ mất phiên theo hành vi chuẩn của trình duyệt.

### 4. Quên mật khẩu

- Button dạng link, không điều hướng và không submit form.
- Khi nhấn, hiển thị alert trong card:
  - Tiêu đề: `Khôi phục mật khẩu`.
  - Nội dung: `Tính năng này cần kết nối backend. Trong bản demo, bạn có thể đăng nhập bằng bất kỳ email hợp lệ nào.`
- Alert có thể được ẩn lại bằng một button nhỏ hoặc tự thay thế khi người dùng submit; ưu tiên có nút đóng để kiểm soát rõ ràng.

## Khả năng truy cập và trường hợp biên

- Form có heading rõ ràng và label thật cho từng input.
- Thứ tự tab: email → mật khẩu → hiện/ẩn → ghi nhớ → quên mật khẩu → đăng nhập.
- Focus ring dùng token hiện có.
- Thông báo lỗi dùng `role="alert"` hoặc vùng live phù hợp.
- Không cho submit nhiều lần trong trạng thái loading.
- Timer submit được dọn khi `LoginScreen` unmount để tránh callback sau khi component bị tháo.
- Nếu storage không khả dụng hoặc thao tác storage ném lỗi, ứng dụng vẫn cho đăng nhập trong state hiện tại; helper đọc/ghi storage dùng `try/catch` và không làm crash UI.
- Khi đăng xuất trong lúc chatbot còn timer phản hồi, timer hiện có vẫn thuộc `App`; không sửa logic chatbot trong thay đổi này. View được đặt lại dashboard, và dữ liệu in-memory giữ nguyên cho tới khi refresh, phù hợp với bản demo không backend.

## Giữ phạm vi và tương thích

- Chỉ thêm cổng login ở cấp `App`, không đưa router vào vì ứng dụng hiện không sử dụng router và chỉ cần hai trạng thái authenticated/unauthenticated.
- Không lưu token giả, email hoặc mật khẩu; chỉ lưu cờ boolean phiên.
- Không tuyên bố đây là xác thực an toàn; chú thích demo phải rõ.
- Không thay đổi hai mục điều hướng còn lại hoặc giao diện chatbot vừa triển khai.

## Xác minh

### Kiểm tra hành vi

1. Mở app khi chưa có storage key: chỉ thấy màn login.
2. Submit rỗng: hiện lỗi bắt buộc cho email và mật khẩu.
3. Email sai định dạng hoặc mật khẩu dưới 6 ký tự: chặn submit và hiện đúng lỗi.
4. Button hiện/ẩn password hoạt động, không submit form.
5. `Quên mật khẩu?` hiển thị alert mô phỏng và không rời trang.
6. Đăng nhập hợp lệ với `Ghi nhớ` bật:
   - Vào dashboard.
   - Reload vẫn đăng nhập.
7. Đăng nhập hợp lệ với `Ghi nhớ` tắt:
   - Vào dashboard.
   - Reload cùng tab vẫn đăng nhập qua session storage.
8. Nhấn `Đăng xuất`:
   - Quay lại login.
   - Cả localStorage và sessionStorage đều được xóa.
   - Đăng nhập lại bắt đầu ở dashboard.
9. Kiểm tra layout desktop và mobile, đặc biệt form không tràn chiều ngang và CTA vẫn dễ thao tác.

### Kiểm tra kỹ thuật

- Chạy `git diff --check` để kiểm tra whitespace và chỉ có các file trong phạm vi thay đổi.
- Chạy `pnpm build` theo script dự án; build phải thành công.
- Không chạy `pnpm format` trong thay đổi này vì đã xác nhận formatter hiện tại ghi lại hàng loạt file ngoài phạm vi và làm hỏng cú pháp type object trong `App.tsx`; giữ style bằng chỉnh sửa có mục tiêu.
- Nếu chạy `pnpm exec tsc --noEmit`, ghi nhận lỗi baseline hiện có tại `vite.figma.config.ts:52`; không sửa lỗi cấu hình đó trong phạm vi login. Phần login phải không tạo thêm lỗi build.
