import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="bg-dark text-white p-3" style={{ width: "240px" }}>
        <h4 className="fw-bold mb-4 text-center">LTW2 Admin</h4>
        <ul className="nav flex-column">
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/dashboard">
              📊 Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/products">
              🍽️ Menu
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/tables">
              💺 Bàn
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/orders">
              🧾 Đơn hàng
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white" to="/admin/users">
              👥 Người dùng
            </Link>
          </li>
          <li className="nav-item mt-4">
            <button className="btn btn-outline-light w-100" onClick={logout}>
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-grow-1 bg-light">
        <div className="p-3 border-bottom bg-white shadow-sm">
          <h5 className="mb-0">Trang quản trị</h5>
        </div>
        <div className="p-4" style={{ overflowY: "auto", height: "calc(100% - 60px)" }}>
          <Outlet /> {/* Hiển thị trang con */}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
