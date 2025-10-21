import React, { useState } from "react";
import axiosClient from "../../api/axiosClient";

function FeedbackForm({ productId, productName }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const email = localStorage.getItem("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/api/feedbacks", {
        customerEmail: email,
        productId,
        productName,
        rating,
        comment,
      });
      alert("✅ Cảm ơn bạn đã đánh giá!");
      setRating(5);
      setComment("");
    } catch (err) {
      alert("❌ Lỗi khi gửi đánh giá!");
    }
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h5 className="fw-bold mb-3">📝 Đánh giá món / dịch vụ</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  fontSize: "1.5rem",
                  color: star <= rating ? "#FFD700" : "#ccc",
                  cursor: "pointer",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            className="form-control mb-3"
            placeholder="Chia sẻ cảm nhận của bạn..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
          ></textarea>
          <button type="submit" className="btn btn-primary">
            Gửi đánh giá
          </button>
        </form>
      </div>
    </div>
  );
}

export default FeedbackForm;
