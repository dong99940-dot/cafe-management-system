import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Card, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const [activeTable, setActiveTable] = useState(null);

  useEffect(() => {
    const checkActiveTable = async () => {
      try {
        const res = await axiosClient.get("/api/tables/my-active");
        if (res.data && res.data.tableNumber) {
          setActiveTable(res.data.tableNumber);
        }
      } catch (err) {
        console.warn("Không có bàn đang phục vụ hoặc lỗi khi kiểm tra:", err);
      }
    };
    checkActiveTable();
  }, []);

  useEffect(() => {
    if (!email) return;
    axiosClient
      .get(`/api/orders/my-orders?email=${email}`)
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Lỗi khi tải lịch sử đơn hàng:", err));
  }, [email]);

  const handleViewCurrentOrder = () => {
    if (activeTable) {
      navigate(`/my-order?table=${activeTable}`);
    } else {
      alert("Bạn hiện không có bàn nào đang phục vụ.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">📜 Lịch sử đặt bàn của bạn</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" onClick={handleViewCurrentOrder}>
            🪑 Đơn hàng hiện tại
          </Button>
          <Button variant="outline-danger" onClick={handleLogout}>
            🚪 Đăng xuất
          </Button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-muted">Bạn chưa có đơn hàng nào.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">🪑 Bàn {order.tableNumber}</h5>
                <Badge
                  bg={
                    order.status === "DONE"
                      ? "success"
                      : order.status === "NEW"
                      ? "primary"
                      : order.status === "PROCESSING"
                      ? "warning"
                      : "secondary"
                  }
                >
                  {order.status}
                </Badge>
              </div>

              <p className="text-muted mb-1">
                <b>Ngày đặt:</b>{" "}
                {new Date(order.createdAt).toLocaleString("vi-VN", {
                  hour12: false,
                })}
              </p>

              <p className="mb-2">
                <b>Tổng tiền:</b>{" "}
                <span className="text-success fw-bold">
                  {order.totalPrice.toLocaleString()} ₫
                </span>
              </p>

              <details>
                <summary className="fw-bold text-primary">
                  Xem chi tiết món
                </summary>
                <ul className="mt-2">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.name} × {item.quantity} ={" "}
                      {(item.price * item.quantity).toLocaleString()} ₫
                      {item.note && (
                        <span className="text-muted small d-block">
                          📝 {item.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </details>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
}

export default OrderHistory;
