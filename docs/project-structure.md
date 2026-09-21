
# CẤU TRÚC DỰ ÁN

Tài liệu này giúp thành viên hiểu vị trí của code và tài liệu trong project **Agent of Change**.


## 1. Cấu trúc Repository

```text
agent-of-change/
├── docs/
│   ├── git-workflow.md
│   ├── Onboard.md
│   └── project-structure.md
│
├── src/
│   └── ...
│
├── .gitignore
├── README.md
└── requirements.txt
```


## 2. Thư mục `docs/`

Chứa toàn bộ tài liệu hướng dẫn và quy trình của project.

* `Onboard.md`: Hướng dẫn thành viên mới cài đặt và chạy project.
* `git-workflow.md`: Quy trình sử dụng Git.
* `project-structure.md`: Giải thích cấu trúc project.


## 3. Thư mục `src/`

Chứa **source code chính** của hệ thống.

Khi project được triển khai đầy đủ, code sẽ được tổ chức theo chuẩn:

```text
src/
├── agents/     # Logic của các Agent (Router, HR Agent, Code Reviewer...)
├── tools/      # Các Tool/Function (Google Calendar, Gmail API, Web Search...)
├── prompts/    # System Prompt / Prompt Template (.txt hoặc .json)
└── memory/     # Memory, Vector DB (ChromaDB) và RAG Engine

```

> **Lưu ý:** Chỉ tạo hoặc thay đổi các thư mục trên khi đã thống nhất với team/mentor.



## 4. Các file chính

| File | Mục đích |
| --- | --- |
| `.gitignore` | Khai báo các file/thư mục không đưa lên Git (môi trường ảo, file `.env`) |
| `README.md` | Giới thiệu tổng quan và hướng dẫn chính của project |
| `requirements.txt` | Danh sách Python dependencies (thư viện cần dùng) |

Cài đặt dependencies:

```bash
pip install -r requirements.txt

```

---

## 5. Quy tắc đặt code

| Nội dung | Vị trí |
| --- | --- |
| Agent | `src/agents/` |
| Tool | `src/tools/` |
| Prompt | `src/prompts/` |
| Memory / RAG | `src/memory/` |
| Tài liệu | `docs/` |

---

## 6. Nguyên tắc làm việc quan trọng

*  **Không commit API Key, Password hoặc file `.env` lên GitHub.**
*  **Không đặt code tùy tiện bên ngoài thư mục `src/`.**
*  **Không đặt tài liệu/báo cáo bên trong thư mục `src/`.**
*  **Không tự ý đổi tên, xóa hoặc di chuyển các thư mục chính.**
*  Khi cần thay đổi cấu trúc project, hãy thảo luận với **Team Lead / Mentor** trước.

