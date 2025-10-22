import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = useMemo(() => searchParams.get("token") || "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Token không hợp lệ. Vui lòng yêu cầu lại liên kết đặt lại mật khẩu.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axiosClient.post("/auth/reset-password", {
        token,
        newPassword: password,
      });
      setMessage(response.data?.message || "Đặt lại mật khẩu thành công");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const apiError = err.response?.data?.error;
      setError(apiError || "Không thể đặt lại mật khẩu lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ width: "360px" }}>
        <h3 className="text-center mb-3 fw-bold">Đặt lại mật khẩu</h3>
        {!token && (
          <div className="alert alert-warning small text-center">
            Không tìm thấy token hợp lệ. Vui lòng kiểm tra lại liên kết đặt lại mật khẩu hoặc gửi yêu cầu mới.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
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

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={isSubmitting || !token}
          >
            {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
          </button>
        </form>

        <p className="text-center small mt-3 mb-0">
          <span className="text-primary fw-bold" role="button" onClick={() => navigate("/login")}>
            Quay lại đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
