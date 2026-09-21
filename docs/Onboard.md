# HƯỚNG DẪN DÀNH CHO ONBOARDING

Chào mừng các bạn đến với dự án **Agent of Change**!

## 1. Công cụ cần cài đặt sẵn trên máy

Trước khi bắt đầu, hãy đảm bảo máy đã cài đặt các công cụ sau:

1. **VS Code:** Trình soạn thảo code chính.

2. **Git:** Đã cài đặt và cấu hình `name` và `email`.

   ```bash
   git config --global user.name "Tên bạn"
   git config --global user.email "email@example.com"
   ```

3. **Python (phiên bản >= 3.10):** Cài đặt phiên bản Python chính thức từ [python.org](https://www.python.org/).

---

## 2. Các bước khởi chạy dự án ở Local

### Bước 1: Clone repository

Mở **Terminal / PowerShell** và chạy:

```bash
git clone https://github.com/Probation-Blueline/agent-of-change.git
```

Sau đó di chuyển vào thư mục dự án:

```bash
cd agent-of-change
```

---

## 3. Tạo môi trường ảo Python

Tạo Virtual Environment:

```bash
python -m venv venv
```

### 3.1. Kích hoạt môi trường trên Windows

```powershell
.\venv\Scripts\activate
```

Sau khi kích hoạt thành công, Terminal thường sẽ hiển thị:

```text
(venv)
```

ở đầu dòng lệnh.

### 3.2. Cài đặt các thư viện cần thiết

Sau khi đã kích hoạt môi trường ảo, chạy:

```bash
pip install -r requirements.txt
```

---

## 4. Kiểm tra môi trường

Kiểm tra phiên bản Python:

```bash
python --version
```

Kiểm tra pip:

```bash
pip --version
```

Kiểm tra môi trường ảo đã được kích hoạt:

```bash
where python
```

Nếu sử dụng Windows, đường dẫn Python nên trỏ tới thư mục:

```text
agent-of-change\venv\Scripts\python.exe
```

---

## 5. Chạy dự án

Sau khi cài đặt đầy đủ dependencies, thực hiện các bước chạy dự án theo hướng dẫn tương ứng với cấu trúc source code.

> **Lưu ý:** Hãy đảm bảo Virtual Environment đã được kích hoạt trước khi chạy các lệnh của dự án.

---

## 6. Quy trình làm việc cơ bản với Git

Trước khi bắt đầu làm việc:

```bash
git pull
```

Kiểm tra trạng thái repository:

```bash
git status
```

Sau khi hoàn thành thay đổi:

```bash
git add .
git commit -m "Mô tả thay đổi"
git push
```

### Một số quy tắc khi commit

Nên đặt commit message ngắn gọn và mô tả đúng nội dung thay đổi.

Ví dụ:

```bash
git commit -m "Add onboarding guide"
```

hoặc:

```bash
git commit -m "Fix authentication API"
```

---

## 7. Cấu trúc quy trình làm việc

Quy trình cơ bản khi tham gia dự án:

```text
Clone Repository
       ↓
Tạo Virtual Environment
       ↓
Cài đặt Dependencies
       ↓
Chạy thử Project
       ↓
Pull code mới nhất
       ↓
Phát triển tính năng
       ↓
Test
       ↓
Commit
       ↓
Push
```

---

## 8. Lưu ý quan trọng

* Không commit thư mục `venv/` lên Git.
* Không commit các file chứa API Key, Password hoặc Secret.
* Luôn kiểm tra `git status` trước khi commit.
* Nên `git pull` trước khi bắt đầu làm việc.
* Đảm bảo code đã được kiểm tra trước khi `git push`.
* Nếu gặp lỗi trong quá trình setup, hãy kiểm tra lại phiên bản Python và các dependencies trong `requirements.txt`.

---

## 9. Hỗ trợ

Nếu gặp vấn đề trong quá trình cài đặt hoặc chạy dự án, hãy:

1. Kiểm tra lại bước setup tương ứng.
2. Đọc thông báo lỗi trong Terminal.
3. Kiểm tra các issue hoặc tài liệu của repository.
4. Liên hệ thành viên phụ trách dự án để được hỗ trợ.
