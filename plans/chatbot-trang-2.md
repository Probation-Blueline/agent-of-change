# Kế hoạch đổi Trang 2 thành Chatbot

## Mục tiêu

Thay đúng mục điều hướng thứ hai hiện có từ **“Tạo bài học”** thành **“Chatbot”**, đồng thời thay toàn bộ nội dung trang tương ứng bằng giao diện hội thoại giữa người dùng và chatbot AI. Hai mục điều hướng còn lại, dashboard, danh sách bài học và các modal quản lý bài học được giữ nguyên.

Người dùng đã xác nhận mở rộng phạm vi ngoài button được chọn để bao gồm tiêu đề và nội dung của riêng trang 2. Chatbot chỉ mô phỏng trong trình duyệt, không gọi API hay cần khóa bí mật.

## Phạm vi file

- Chỉnh sửa duy nhất `src/app/App.tsx`.
- Không thay đổi token màu, font, stylesheet toàn cục, component dùng chung hoặc cấu hình dự án.

## Thiết kế và trải nghiệm

### 1. Điều hướng và tiêu đề trang

- Đổi giá trị view thứ hai từ tên kỹ thuật `create` sang `chatbot` để mã phản ánh đúng chức năng mới.
- Đổi nhãn của riêng mục điều hướng thứ hai thành `Chatbot`.
- Đổi biểu tượng bút chì của riêng mục này sang biểu tượng chatbot phù hợp từ `lucide-react`; không thay đổi biểu tượng hay nội dung của hai button anh em.
- Khi chọn mục này, topbar hiển thị biểu tượng chatbot và tiêu đề `Chatbot AI` thay cho `Tạo bài học mới`.
- Giữ nguyên ngày tháng, thông báo và avatar hiện có trên topbar.

### 2. Bố cục trang chatbot

Thay khối form “Tạo bài học” bằng một khung chat sử dụng cùng ngôn ngữ thiết kế hiện tại: nền card trắng, viền theo token `border`, bo góc lớn, màu xanh `primary`, font Nunito/Fredoka và bóng đổ nhẹ.

Khung chat gồm:

- **Header hội thoại**: avatar bot, tên `Wapple AI`, mô tả `Gia sư tiếng Anh của bạn`, và trạng thái trực tuyến.
- **Vùng tin nhắn có thể cuộn**:
  - Tin nhắn mở đầu của bot giới thiệu vai trò gia sư tiếng Anh song ngữ.
  - Một vài chip gợi ý ngắn như luyện hội thoại, sửa ngữ pháp và học từ vựng; nhấn chip sẽ gửi chính nội dung đó như tin nhắn người dùng.
  - Tin nhắn bot căn trái với avatar; tin nhắn người dùng căn phải và dùng màu primary.
  - Khi bot đang chuẩn bị phản hồi, hiển thị trạng thái ba chấm/“đang trả lời” ngắn gọn.
- **Vùng nhập liệu cố định phía dưới**:
  - Ô nhập nhiều dòng với placeholder bằng tiếng Việt.
  - Button gửi dùng icon `Send` và có nhãn hỗ trợ truy cập.
  - Button bị vô hiệu hóa khi nội dung chỉ có khoảng trắng hoặc khi bot đang phản hồi.
  - Gửi bằng click hoặc phím Enter; Shift+Enter dùng để xuống dòng.
- Bố cục phải co giãn theo chiều rộng phần nội dung hiện có, có chiều cao hợp lý để khu vực tin nhắn cuộn bên trong thay vì kéo dài toàn trang.

### 3. Hành vi mô phỏng

- Khai báo kiểu dữ liệu tin nhắn gồm `id`, `role` (`user` hoặc `assistant`) và `content`.
- Khởi tạo state hội thoại bằng lời chào song ngữ của Wapple AI.
- Khi gửi:
  1. Chuẩn hóa bằng `trim`; bỏ qua nội dung rỗng.
  2. Thêm tin nhắn người dùng vào lịch sử và xóa ô nhập.
  3. Bật trạng thái bot đang trả lời.
  4. Sau một độ trễ ngắn, thêm phản hồi mô phỏng của bot rồi tắt trạng thái chờ.
- Phản hồi mô phỏng dựa trên một số nhóm từ khóa đơn giản để tạo cảm giác phù hợp ngữ cảnh:
  - `grammar`/`ngữ pháp`: đưa ra hướng dẫn sửa câu và mời người dùng gửi câu cần kiểm tra.
  - `vocabulary`/`từ vựng`: đề xuất nhóm từ và ví dụ song ngữ.
  - `conversation`/`hội thoại`/`speaking`: bắt đầu một câu hỏi hội thoại tiếng Anh ngắn.
  - Trường hợp khác: phản hồi hỗ trợ chung bằng tiếng Anh kèm giải thích tiếng Việt ngắn.
- Không lưu hội thoại sau khi tải lại trang và không mô tả đây là AI thật.
- Dọn timer khi component unmount để tránh cập nhật state sau khi rời trang/tải lại.
- Tự cuộn xuống tin nhắn mới nhất sau khi gửi hoặc nhận phản hồi.

## Dọn mã cũ trong đúng phạm vi trang 2

- Xóa bốn state chỉ phục vụ form tạo bài học: chủ đề, tiêu đề, đoạn văn và trạng thái tạo thành công.
- Xóa `handleCreate` vì trang 2 không còn tạo bài học.
- Giữ nguyên `addLesson` vì modal “Thêm bài học” trong trang danh sách vẫn sử dụng hàm này.
- Loại bỏ các import icon không còn dùng sau khi xóa form và thêm các icon chatbot/gửi tin nhắn cần thiết.
- Không thay đổi dữ liệu bài học, chức năng tìm kiếm/sắp xếp, sửa/xóa/thêm bài trong trang danh sách.

## Thành phần và token

- Tận dụng các token Tailwind hiện có như `bg-card`, `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `border-border`, `ring-ring`.
- Dùng icon từ `lucide-react`, không thêm dependency mới.
- Dùng các primitive UI cục bộ hiện có cho điều khiển mới khi phù hợp (`Button`, `Textarea`, `ScrollArea`) thay vì tạo component hệ thống mới hoặc sửa các file component dùng chung.
- Không thêm màu hex, stylesheet riêng hoặc ảnh ngoài.

## Khả năng truy cập và trường hợp biên

- Button gửi có tên truy cập rõ ràng và trạng thái disabled đúng.
- Ô nhập có label ẩn hoặc `aria-label` mô tả mục đích.
- Tin nhắn và trạng thái bot có độ tương phản theo token hiện tại.
- Không gửi tin nhắn rỗng hoặc toàn khoảng trắng.
- Ngăn gửi liên tiếp trong lúc bot đang phản hồi để thứ tự hội thoại không bị lệch.
- Nội dung dài được xuống dòng, không làm tràn khung chat.

## Xác minh

1. Kiểm tra thủ công phạm vi mã để đảm bảo chỉ mục điều hướng thứ hai và trang tương ứng thay đổi; hai mục điều hướng khác không bị đổi.
2. Chạy formatter theo script dự án: `pnpm format`.
3. Vì đây là thay đổi UI và logic tương tác tương đối rộng, chạy build sản xuất theo script dự án: `pnpm build`.
4. Xác minh bằng code/build rằng:
   - TypeScript/Vite build thành công, không còn import hoặc state không dùng.
   - Mục thứ hai hiển thị `Chatbot` và mở đúng trang chatbot.
   - Enter/click gửi tin nhắn; Shift+Enter xuống dòng.
   - Bot phản hồi mô phỏng, trạng thái chờ và tự cuộn hoạt động.
   - Dashboard, danh sách bài học và các modal quản lý bài học vẫn giữ hành vi cũ.
