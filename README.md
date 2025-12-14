# 🍽️ HỆ THỐNG QUẢN LÝ VÀ ĐẶT HÀNG F&B

## 📌 Tóm Tắt Dự Án (Project Overview)

Đây là giải pháp full-stack toàn diện được thiết kế để số hóa quy trình vận hành của một nhà hàng, quán cà phê hoặc dịch vụ giao hàng. Hệ thống hỗ trợ quản lý menu, xử lý đơn hàng, đặt bàn trực tuyến và cung cấp bảng điều khiển (dashboard) báo cáo chi tiết cho chủ sở hữu, nhằm tối ưu hóa hoạt động và nâng cao trải nghiệm khách hàng.

---

## ✨ Các Tính Năng Nổi Bật (Key Features)

Dự án bao gồm hai mặt chính: Quản lý (dành cho Admin/Nhân viên) và Đặt hàng/Booking (dành cho Khách hàng).

### 👩‍💻 Khách hàng (Client/Public Site)
* Đặt hàng Trực tuyến (Online Ordering): Khách hàng dễ dàng duyệt menu, thêm món vào giỏ hàng, tùy chỉnh và đặt hàng.
* Đặt Bàn (Table Booking): Chức năng kiểm tra tính khả dụng của bàn theo ngày/giờ và xác nhận đặt bàn.
* Tìm kiếm và Lọc: Lọc món ăn theo danh mục, giá cả, hoặc tìm kiếm theo tên.
* Tài khoản Cá nhân: Lịch sử đơn hàng và thông tin cá nhân.

### 📊 Quản trị (Admin/Management Panel)
* Quản lý Menu (Management Panel): Quản lý Menu động bằng CRUD (Tạo, Đọc, Cập nhật, Xóa) sản phẩm, phân loại, giá cả và tình trạng sẵn có.
* Xử lý Đơn hàng (Real-time Order Processing): Theo dõi trạng thái đơn hàng theo thời gian thực (Đang chờ, Đang chế biến, Sẵn sàng, Đã giao).
* Quản lý Bàn: Theo dõi sơ đồ bàn và tình trạng sử dụng của từng bàn.
* Báo cáo & Phân tích: Dashboard hiển thị doanh thu, món bán chạy nhất, và hiệu suất giao hàng chi tiết.
* Quản lý Người dùng: Phân quyền truy cập cho các vai trò khác nhau.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Lĩnh vực | Công nghệ |
| :--- | :--- |
| **Front-end** | ReactJS |
| **Back-end** | Spring Boot, MongoDB |
| **Database** | MongoDB |

---

## 🚀 Hướng Dẫn Cài Đặt và Vận hành (Getting Started)

1. Clone repository.
2. Chạy lệnh: `docker compose build` & `docker compose up` để build dự án.
