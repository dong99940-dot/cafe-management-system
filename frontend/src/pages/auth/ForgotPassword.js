import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await axiosClient.post("/auth/forgot-password", { email });
      setMessage(response.data?.message || "Nếu email tồn tại, liên kết đặt lại mật khẩu đã được gửi");
      setEmail("");
    } catch (err) {
      const apiError = err.response?.data?.error;
      setError(apiError || "Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h3 className="text-center mb-3 fw-bold">Quên mật khẩu</h3>
        <p className="text-muted small text-center mb-4">
          Nhập email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu.
        </p>

        <form onSubmit={handleSubmit}>
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

          {message && (
            <div className="alert alert-success py-2 text-center small mb-3">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2 text-center small mb-3">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
            {isSubmitting ? "Đang gửi..." : "Gửi liên kết"}
          </button>
        </form>

        <p className="text-center small mt-3 mb-0">
          <span
            className="text-primary fw-bold"
            role="button"
            onClick={() => navigate("/login")}
          >
            Quay lại đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
