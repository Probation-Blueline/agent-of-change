# HƯỚNG DẪN QUY TRÌNH LÀM VIỆC VỚI GIT & GITHUB FOR TEAM

Tài liệu này quy định quy trình quản lý mã nguồn, tạo nhánh và gửi Pull Request (PR) dành cho toàn bộ thành viên trong dự án **Agent of Change**.

---

## Quy tắc vàng (Must-Remember Rules)

1. **KHÔNG BAO GIỜ push code trực tiếp lên nhánh `main`.**
2. Tất cả công việc (Features, Fixes, Docs) đều phải làm trên **nhánh riêng (Branch)**.
3. Khi hoàn thành task, phải tạo **Pull Request (PR)** và gán **Lead/Mentor** vào Review.
4. Luôn `git pull` code mới nhất về máy trước khi bắt đầu viết code mới.

---

## Quy trình làm việc 5 bước (5-Step Git Workflow)

### Bước 1: Lấy code mới nhất về máy
Trước khi làm task mới, hãy chuyển về nhánh `main` và cập nhật code mới nhất từ team:
```bash
git checkout main
git pull origin main