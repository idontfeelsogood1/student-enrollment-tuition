# student-enrollment-tuition

Hệ thống **Quản lý việc đăng ký môn học và thu học phí của sinh viên** – đồ án môn Công nghệ phần mềm (502045), Nhóm Ba Anh Tài.

## Thành viên

| Thành viên | MSSV | Vai trò |
|---|---|---|
| Lê Trọng Dương | 52400261 | Trưởng nhóm |
| Đỗ Quang Hiệp | 52400265 | Thành viên |
| Trần Gia Minh | 52400082 | Thành viên |

## Cấu trúc thư mục

```
student-enrollment-tuition/
├── README.md
├── .gitignore
├── docs/          # Tài liệu thiết kế Buổi 6
├── backend/       # Mã nguồn phía máy chủ
└── frontend/      # Mã nguồn giao diện
```

## Công nghệ

- **Backend:** Node.js 22 + Express 5, mysql2 (truy vấn tham số hóa), Jest + Supertest
- **Frontend:** React 19 + Vite, React Router, Axios
- **Cơ sở dữ liệu:** MySQL 8.4 (schema tại `backend/db/schema.sql`)

## Cài đặt và chạy

### 1. Cơ sở dữ liệu

Cách nhanh nhất là dùng Docker (schema được tự động nạp khi container khởi tạo lần đầu):

```bash
export DB_PASSWORD=<mat-khau-tu-dat>
docker compose up -d mysql
```

Hoặc dùng MySQL cài sẵn trên máy:

```bash
mysql -u root -p -e "CREATE DATABASE university_db"
mysql -u root -p university_db < backend/db/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env      # điền DB_PASSWORD, không commit file .env
npm install
npm run dev               # http://localhost:8080
npm test
```

Kiểm tra nhanh:

- `GET http://localhost:8080/api/v1/health` → `{"status":"UP"}`
- `GET http://localhost:8080/api/v1/health/db` → `{"database":"UP"}` khi kết nối CSDL thành công

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev               # http://localhost:5173
```

Thanh dưới trang hiển thị `Backend: UP` khi frontend gọi được API.

## Quy trình Git (Git Flow)

| Nhánh | Mục đích |
|---|---|
| `main` | Phiên bản ổn định, sẵn sàng phát hành |
| `develop` | Tích hợp các chức năng đang phát triển |
| `feature/login` | Chức năng đăng nhập |
| `feature/enrollment` | Chức năng đăng ký học phần |
| `feature/tuition` | Chức năng học phí, thanh toán |

Quy tắc:

1. Không commit trực tiếp lên `main`.
2. Tạo nhánh `feature/*` từ `develop`, push và mở Pull Request vào `develop`.
3. Mỗi Pull Request cần ít nhất một thành viên khác review và approve trước khi merge.
4. Không commit mật khẩu, khóa API hoặc dữ liệu sinh viên thật; file `.env` đã nằm trong `.gitignore`.
