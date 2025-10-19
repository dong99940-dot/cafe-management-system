import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function ThankYou() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleViewOrder = () => {
    if (tableNumber) {
      navigate(`/my-order?table=${tableNumber}`);
    } else {
      alert("Không xác định được bàn. Vui lòng quay lại menu.");
      navigate("/menu");
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-center bg-light">
      <div className="card shadow p-5" style={{ maxWidth: "500px" }}>
        <h1 className="text-success mb-3">🎉 Cảm ơn bạn!</h1>
        <p className="fs-5 text-muted">
          Đơn hàng của bạn đã được gửi thành công. Nhân viên của quán sẽ phục vụ
          bạn trong thời gian sớm nhất.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/148/148767.png"
          alt="thank you"
          className="my-3"
          style={{
            width: "120px",
            height: "120px",
            display: "block",
            margin: "0 auto",
          }}
        />

        <div className="mt-4 d-flex flex-column gap-2">
          <button className="btn btn-success" onClick={handleViewOrder}>
            🧾 Xem đơn hàng của tôi
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
