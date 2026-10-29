-- ==============================================================
-- KHOA CÔNG NGHỆ THÔNG TIN - ĐẠI HỌC TÔN ĐỨC THẮNG
-- ĐỀ TÀI: QUẢN LÝ ĐĂNG KÝ MÔN HỌC VÀ THU HỌC PHÍ
-- SCRIPT TẠO CƠ SỞ DỮ LIỆU CHUẨN HÓA (DDL SQL)
-- ==============================================================

-- 1. Bảng tài khoản người dùng (users)
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL DEFAULT 'STUDENT',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('STUDENT', 'ADMIN', 'ACCOUNTANT')),
    CONSTRAINT chk_user_status CHECK (status IN ('ACTIVE', 'LOCKED', 'INACTIVE'))
);

-- 2. Bảng hồ sơ sinh viên (students)
CREATE TABLE students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    student_code VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_users FOREIGN KEY (user_id) 
        REFERENCES users(user_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 3. Bảng danh mục môn học (courses)
CREATE TABLE courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code VARCHAR(20) NOT NULL UNIQUE,
    course_name VARCHAR(150) NOT NULL,
    credits INT NOT NULL DEFAULT 3,
    CONSTRAINT chk_course_credits CHECK (credits > 0 AND credits <= 10)
);

-- 4. Bảng danh mục học kỳ (semesters)
CREATE TABLE semesters (
    semester_id INT AUTO_INCREMENT PRIMARY KEY,
    semester_name VARCHAR(50) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT uq_semester_year UNIQUE (semester_name, academic_year)
);

-- 5. Bảng lớp học phần mở (course_sections)
CREATE TABLE course_sections (
    section_id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    semester_id INT NOT NULL,
    section_code VARCHAR(30) NOT NULL UNIQUE,
    capacity INT NOT NULL DEFAULT 60,
    current_enrolled INT NOT NULL DEFAULT 0,
    schedule VARCHAR(255) NOT NULL,
    CONSTRAINT chk_section_capacity CHECK (capacity > 0),
    CONSTRAINT chk_section_enrolled CHECK (current_enrolled >= 0 AND current_enrolled <= capacity),
    CONSTRAINT fk_sections_courses FOREIGN KEY (course_id) 
        REFERENCES courses(course_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_sections_semesters FOREIGN KEY (semester_id) 
        REFERENCES semesters(semester_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 6. Bảng kết quả đăng ký học phần (enrollments)
CREATE TABLE enrollments (
    enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    section_id INT NOT NULL,
    enrollment_date DATE NOT NULL DEFAULT (CURRENT_DATE),
    status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_section UNIQUE (student_id, section_id),
    CONSTRAINT chk_enroll_status CHECK (status IN ('CONFIRMED', 'CANCELLED')),
    CONSTRAINT fk_enrollments_students FOREIGN KEY (student_id) 
        REFERENCES students(student_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_enrollments_sections FOREIGN KEY (section_id) 
        REFERENCES course_sections(section_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 7. Bảng hóa đơn học phí (tuition_invoices)
CREATE TABLE tuition_invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    semester_id INT NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_invoice_amount CHECK (total_amount >= 0),
    CONSTRAINT chk_invoice_status CHECK (status IN ('UNPAID', 'PARTIAL', 'PAID')),
    CONSTRAINT fk_invoices_students FOREIGN KEY (student_id) 
        REFERENCES students(student_id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_invoices_semesters FOREIGN KEY (semester_id) 
        REFERENCES semesters(semester_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 8. Bảng chi tiết giao dịch thanh toán (payments)
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(30) NOT NULL DEFAULT 'VNPAY',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_ref VARCHAR(100),
    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_payment_method CHECK (method IN ('VNPAY', 'MOMO', 'BANKING', 'CASH')),
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED')),
    CONSTRAINT fk_payments_invoices FOREIGN KEY (invoice_id) 
        REFERENCES tuition_invoices(invoice_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ==============================================================
-- THIẾT LẬP CHỈ MỤC (INDEXES) TỐI ƯU HÓA HIỆU NĂNG TRUY VẤN
-- ==============================================================
CREATE INDEX idx_students_student_code ON students(student_code);
CREATE INDEX idx_sections_course_semester ON course_sections(course_id, semester_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_section ON enrollments(section_id);
CREATE INDEX idx_invoices_student ON tuition_invoices(student_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
