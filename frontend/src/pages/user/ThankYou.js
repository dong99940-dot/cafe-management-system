import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { Form, Button } from "react-bootstrap";

function ThankYou() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table");
  const email = localStorage.getItem("email");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleFeedback = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/api/feedbacks", {
        customerEmail: email,
        productId: null, 
        productName: `Bàn ${tableNumber}`,
        rating,
        comment,
      });
      setSubmitted(true);
      alert("✅ Cảm ơn bạn đã gửi đánh giá!");
    } catch (err) {
      alert("❌ Lỗi khi gửi đánh giá. Vui lòng thử lại!");
    }
  };
  
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
          bạn trong thời gian sớm nhất tại bàn{" "}
          <strong>{tableNumber || "?"}</strong>.
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

        {/* 🔹 Form đánh giá dịch vụ */}
        <div className="mt-4 text-start">
          {!submitted ? (
            <>
              <h5 className="fw-bold mb-3 text-center">📝 Đánh giá dịch vụ</h5>
              <Form onSubmit={handleFeedback}>
                <div className="mb-3 text-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setRating(star)}
                      style={{
                        fontSize: "1.8rem",
                        color: star <= rating ? "#FFD700" : "#ccc",
                        cursor: "pointer",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Chia sẻ cảm nhận của bạn (vd: món ngon, phục vụ nhanh...)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="mb-3"
                  required
                />

                <Button variant="primary" type="submit" className="w-100">
                  Gửi đánh giá
                </Button>
              </Form>
            </>
          ) : (
            <div className="alert alert-success text-center">
              💬 Cảm ơn bạn đã gửi phản hồi! Chúng tôi rất trân trọng ý kiến của
              bạn ❤️
            </div>
          )}
        </div>

        {/* 🔹 Các nút điều hướng */}
        <div className="mt-4 d-flex flex-column gap-2">
          <button className="btn btn-success" onClick={handleViewOrder}>
            🧾 Xem đơn hàng của tôi
          </button>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => navigate("/order-history")}
          >
            📜 Xem lịch sử đặt bàn
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
