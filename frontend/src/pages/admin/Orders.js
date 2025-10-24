import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Modal, Button, Form, Badge } from "react-bootstrap";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterTable, setFilterTable] = useState("");

  const fetchOrders = async () => {
    try {
      const url = filterTable
        ? `/api/orders/table/${filterTable}`
        : "/api/orders";
      const res = await axiosClient.get(url);

      const sortedOrders = [...res.data].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đơn hàng:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterTable]);

  const handleView = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await axiosClient.put(`/api/orders/${orderId}/status?status=${newStatus}`);
      fetchOrders();
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      alert("Không thể cập nhật trạng thái đơn hàng.");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">🧾 Quản lý Đơn hàng</h2>

      {/* Bộ lọc */}
      <div className="d-flex align-items-center mb-3">
        <Form.Control
          type="number"
          placeholder="Nhập số bàn để lọc"
          value={filterTable}
          onChange={(e) => setFilterTable(e.target.value)}
          style={{ width: "200px" }}
        />
        {filterTable && (
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => setFilterTable("")}
          >
            Xoá lọc
          </Button>
        )}
      </div>

      {/* Danh sách đơn */}
      <table className="table table-hover align-middle shadow-sm">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Số bàn</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th style={{ width: "200px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((o, idx) => (
              <tr key={o.id}>
                <td>{idx + 1}</td>
                <td>{o.tableNumber}</td>
                <td>{o.totalPrice.toLocaleString()} ₫</td>
                <td>
                  <Badge
                    bg={
                      o.status === "NEW"
                        ? "primary"
                        : o.status === "PROCESSING"
                        ? "warning"
                        : o.status === "DONE"
                        ? "success"
                        : "secondary"
                    }
                    className="fs-6"
                  >
                    {o.status === "NEW"
                      ? "Mới"
                      : o.status === "PROCESSING"
                      ? "Đang xử lý"
                      : o.status === "DONE"
                      ? "Hoàn thành"
                      : "Đã huỷ"}
                  </Badge>
                </td>
                <td>
                  {new Date(o.createdAt).toLocaleString("vi-VN", {
                    hour12: false,
                  })}
                </td>
                <td>
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleView(o)}
                  >
                    👁️ Xem
                  </Button>

                  {o.status !== "DONE" && o.status !== "CANCELLED" && (
                    <>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-2"
                        onClick={() => updateStatus(o.id, "DONE")}
                      >
                        ✅ Hoàn thành
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => updateStatus(o.id, "CANCELLED")}
                      >
                        ❌ Huỷ
                      </Button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted py-3">
                Chưa có đơn hàng nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal chi tiết đơn */}
      <Modal show={!!selectedOrder} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <p>
                <b>Bàn:</b> {selectedOrder.tableNumber} <br />
                <b>Trạng thái:</b>{" "}
                <Badge
                  bg={
                    selectedOrder.status === "DONE"
                      ? "success"
                      : selectedOrder.status === "PROCESSING"
                      ? "warning"
                      : "info"
                  }
                  className="fs-6"
                >
                  {selectedOrder.status}
                </Badge>
                <br />
                <b>Thời gian:</b>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString("vi-VN", {
                  hour12: false,
                })}
              </p>

              <table className="table table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>Tên món</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toLocaleString()} ₫</td>
                      <td>
                        {(item.price * item.quantity).toLocaleString()} ₫
                      </td>
                      <td>
                        {item.note ? (
                          <div
                            className="p-2 rounded"
                            style={{
                              backgroundColor: "#fff3cd",
                              border: "1px solid #ffeeba",
                            }}
                          >
                            📝 {item.note}
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-end fw-bold fs-5 mt-3">
                Tổng cộng: {selectedOrder.totalPrice.toLocaleString()} ₫
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Orders;
