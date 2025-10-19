import React from "react";

function NotFound() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100 text-center bg-light"
    >
      <div className="card shadow p-5" style={{ maxWidth: "500px" }}>
        <h1 className="text-danger fw-bold mb-3">404</h1>
        <h4 className="mb-3">Trang không tồn tại 🚫</h4>
        <p className="text-muted">
          Có thể bạn đã nhập sai đường dẫn hoặc không có quyền truy cập vào trang này.
        </p>

        <img
          src="https://cdn-icons-png.flaticon.com/512/7486/7486769.png"
          alt="not found"
          className="my-3"
          style={{ width: "120px", height: "120px", display: "block", margin: "0 auto"}}
        />
      </div>
    </div>
  );
}

export default NotFound;
