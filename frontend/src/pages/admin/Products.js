import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Modal, Button, Form } from "react-bootstrap";

function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    imageUrl: "",
    available: true,
  });

  const fetchProducts = async () => {
    try {
      const res = await axiosClient.get("/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", category: "", price: "", imageUrl: "", available: true });
    setShowModal(true);
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await axiosClient.put(`/api/products/${editingProduct.id}`, formData);
      } else {
        await axiosClient.post("/api/products", formData);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Lỗi khi lưu sản phẩm");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn chắc chắn muốn xoá món này?")) {
      try {
        await axiosClient.delete(`/api/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">🍽️ Quản lý Menu</h2>

      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={handleAdd}>
          ➕ Thêm món mới
        </Button>
      </div>

      {/* Bảng hiển thị sản phẩm */}
      <table className="table table-hover align-middle shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Tên món</th>
            <th>Loại</th>
            <th>Giá</th>
            <th>Hình ảnh</th>
            <th>Trạng thái</th>
            <th style={{ width: "160px" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price.toLocaleString()} ₫</td>
                <td>
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt="img"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  ) : (
                    <span className="text-muted">Không có</span>
                  )}
                </td>
                <td>
                  <span
                    className={`badge ${
                      p.available ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {p.available ? "Còn bán" : "Ngưng bán"}
                  </span>
                </td>
                <td>
                  <Button variant="outline-warning" size="sm" className="me-2" onClick={() => handleEdit(p)}>
                    ✏️ Sửa
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(p.id)}>
                    ❌ Xoá
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center text-muted py-3">
                Chưa có sản phẩm nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal thêm/sửa */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingProduct ? "Chỉnh sửa món" : "Thêm món mới"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên món</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại</Form.Label>
              <Form.Control
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link hình ảnh</Form.Label>
              <Form.Control
                type="text"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Còn bán"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
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

export default Products;
