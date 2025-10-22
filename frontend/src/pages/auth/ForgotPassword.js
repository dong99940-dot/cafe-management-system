import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axiosClient.post("/auth/forgot-password", { email });
      setMessage("✅ Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!");
      setEmail(""); // Xóa input sau khi gửi
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "⚠️ Không thể gửi email. Vui lòng kiểm tra lại địa chỉ email."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="card shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-3">🔐 Quên mật khẩu</h3>

        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email đăng ký</Form.Label>
            <Form.Control
              type="email"
              placeholder="Nhập email của bạn..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" /> Đang gửi...
              </>
            ) : (
              "📨 Gửi yêu cầu đặt lại"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default ForgotPassword;
