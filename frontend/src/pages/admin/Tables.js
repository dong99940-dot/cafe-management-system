import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Modal, Button, Form } from "react-bootstrap";

function Tables() {
  const [tables, setTables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: 0,
    status: "TRONG",
    capacity: 4,
    reservedBy: ""
  });

  // 🔹 Lấy danh sách bàn
  const fetchTables = async () => {
    try {
      const res = await axiosClient.get("/api/tables");
      setTables(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bàn:", err);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // 🔹 Mở modal thêm mới
  const handleAdd = () => {
    setEditingTable(null);
    setFormData({ tableNumber: 0, status: "TRONG", capacity: 4, reservedBy: "" });
    setShowModal(true);
  };

  // 🔹 Mở modal chỉnh sửa
  const handleEdit = (t) => {
    setEditingTable(t);
    setFormData({ 
      tableNumber: t.tableNumber, 
      status: t.status,
      capacity: t.capacity || 4,
      reservedBy: t.reservedBy || ""
    });
    setShowModal(true);
  };

  // 🔹 Lưu bàn (thêm mới hoặc cập nhật)
  const handleSave = async () => {
    try {
      if (editingTable) {
        // ✅ Backend không có endpoint update toàn bộ, chỉ update status
        await axiosClient.put(
          `/api/tables/update-status/${editingTable.tableNumber}?status=${formData.status}`
        );
      } else {
        await axiosClient.post("/api/tables", formData);
      }
      setShowModal(false);
      fetchTables();
    } catch (err) {
      console.error("Lỗi khi lưu bàn:", err);
      console.log("Chi tiết lỗi:", err.response?.data);
      alert("Không thể lưu bàn. Kiểm tra log console để biết thêm chi tiết.");
    }
  };

  // 🔹 Xoá bàn
  const handleDelete = async (tableNumber) => {
    if (window.confirm("Bạn có chắc muốn xóa bàn này không?")) {
      try {
        await axiosClient.delete(`/api/tables/${tableNumber}`);
        fetchTables();
      } catch (err) {
        console.error("Lỗi khi xóa bàn:", err);
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">💺 Quản lý Bàn</h2>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleAdd}>
          ➕ Thêm bàn mới
        </Button>
      </div>

      {/* Danh sách bàn */}
      <table className="table table-hover align-middle shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Số bàn</th>
            <th>Sức chứa</th>
            <th>Trạng thái</th>
            <th>Đặt bởi</th>
            <th style={{ width: "160px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tables.length > 0 ? (
            tables.map((t) => (
              <tr key={t.id}>
                <td>{t.tableNumber}</td>
                <td>{t.capacity} người</td>
                <td>
                  <span
                    className={`badge fs-6 ${
                      t.status === "TRONG"
                        ? "bg-success"
                        : t.status === "PHUC_VU"
                        ? "bg-warning text-dark"
                        : "bg-secondary"
                    }`}
                  >
                    {t.status === "TRONG"
                      ? "Còn trống"
                      : t.status === "PHUC_VU"
                      ? "Đang phục vụ"
                      : "Đã thanh toán"}
                  </span>
                </td>
                <td>{t.reservedBy || "-"}</td>
                <td>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(t)}
                  >
                    ✏️ Sửa
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(t.tableNumber)}
                  >
                    ❌ Xoá
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-muted py-3">
                Chưa có bàn nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal thêm / sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTable ? "Chỉnh sửa bàn" : "Thêm bàn mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Số bàn</Form.Label>
              <Form.Control
                type="number"
                value={formData.tableNumber}
                onChange={(e) =>
                  setFormData({ ...formData, tableNumber: parseInt(e.target.value, 10) || 0 })
                }
                disabled={!!editingTable}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sức chứa (số người)</Form.Label>
              <Form.Control
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: parseInt(e.target.value, 10) || 4 })
                }
                disabled={!!editingTable}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option value="TRONG">Còn trống</option>
                <option value="PHUC_VU">Đang phục vụ</option>
                <option value="DA_THANH_TOAN">Đã thanh toán</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Đặt bởi (tùy chọn)</Form.Label>
              <Form.Control
                type="text"
                value={formData.reservedBy}
                onChange={(e) =>
                  setFormData({ ...formData, reservedBy: e.target.value })
                }
                disabled={!!editingTable}
                placeholder="Tên khách hàng"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Tables;