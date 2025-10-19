import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // reset lỗi cũ

    try {
      const res = await axiosClient.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);

      if (res.data.role === "ADMIN" || res.data.role === "ROOT") {
        navigate("/admin/dashboard");
      } else {
        navigate("/menu");
      }
    } catch (err) {
      if (err.response) {
        if (err.response.status === 403) {
          setError("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        } else if (err.response.status === 401) {
          setError("Sai email hoặc mật khẩu!");
        } else {
          setError("Đăng nhập thất bại. Vui lòng thử lại sau.");
        }
      } else {
        setError("Không thể kết nối đến máy chủ. Kiểm tra mạng của bạn.");
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h3 className="text-center mb-3 fw-bold">Đăng nhập</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="alert alert-danger py-2 text-center small mb-3">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100">
            Đăng nhập
          </button>
        </form>

        <p className="text-center small mt-3">
          Chưa có tài khoản?{" "}
          <span
            className="text-primary fw-bold"
            role="button"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
