import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Button, Form, Modal } from "react-bootstrap";

function Feedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");

  const fetchFeedbacks = async () => {
    try {
      const res = await axiosClient.get("/api/feedbacks");
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Lỗi khi tải feedback:", err);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleReply = async () => {
    try {
      await axiosClient.put(`/api/feedbacks/${selected.id}/reply?reply=${reply}`);
      setReply("");
      setSelected(null);
      fetchFeedbacks();
      alert("Đã phản hồi khách hàng!");
    } catch {
      alert("Lỗi khi gửi phản hồi!");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">💬 Quản lý Đánh giá & Feedback</h2>

      <table className="table table-hover align-middle shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Email</th>
            <th>Món / Dịch vụ</th>
            <th>⭐ Rating</th>
            <th>Bình luận</th>
            <th>Phản hồi</th>
            <th>Thời gian</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.length > 0 ? (
            feedbacks.map((f) => (
              <tr key={f.id}>
                <td>{f.customerEmail}</td>
                <td>{f.productName || "Dịch vụ"}</td>
                <td>{"★".repeat(f.rating)}</td>
                <td>{f.comment}</td>
                <td>{f.adminReply || "Chưa phản hồi"}</td>
                <td>{new Date(f.createdAt).toLocaleString("vi-VN")}</td>
                <td>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => setSelected(f)}
                  >
                    ✉️ Phản hồi
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center text-muted">
                Chưa có feedback nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal phản hồi */}
      <Modal show={!!selected} onHide={() => setSelected(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Phản hồi khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><b>Khách:</b> {selected?.customerEmail}</p>
          <p><b>Bình luận:</b> {selected?.comment}</p>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Nhập phản hồi..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelected(null)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleReply}>
            Gửi phản hồi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Feedbacks;
