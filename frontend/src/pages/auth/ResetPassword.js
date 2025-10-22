import React, { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import { useSearchParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [valid, setValid] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axiosClient.get(`/auth/validate-reset-token?token=${token}`);
        if (res.data.valid) setValid(true);
      } catch {
        setMessage("Token không hợp lệ hoặc đã hết hạn.");
      }
    };
    if (token) validateToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Mật khẩu không khớp!");
      return;
    }
    try {
      await axiosClient.post("/auth/reset-password", { token, password });
      alert("✅ Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (err) {
      alert("❌ Lỗi khi đặt lại mật khẩu.");
    }
  };

  if (!token) return <p>Không tìm thấy token.</p>;

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h3 className="text-center mb-3 fw-bold">🔒 Đặt lại mật khẩu</h3>

        {!valid ? (
          <p className="text-danger text-center">{message || "Đang xác thực token..."}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="form-control mb-3"
              placeholder="Xác nhận mật khẩu"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-success w-100">
              Cập nhật mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
