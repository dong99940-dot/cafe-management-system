import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Kiểm tra đơn giản trước khi gửi
    if (!form.fullName || !form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosClient.post("/auth/register", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });

      setSuccess("Đăng ký thành công! Đang chuyển sang trang đăng nhập...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      if (err.response?.status === 409)
        setError("Email này đã được đăng ký!");
      else setError("Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-3 fw-bold">Đăng ký tài khoản</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="Họ và tên"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="confirmPassword"
              className="form-control"
              placeholder="Xác nhận mật khẩu"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center small mt-3">
          Đã có tài khoản?{" "}
          <span
            className="text-primary fw-bold"
            role="button"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
