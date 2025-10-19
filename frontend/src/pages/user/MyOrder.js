import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate, useSearchParams } from "react-router-dom";

function MyOrder() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableNumber = searchParams.get("table");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, menuRes] = await Promise.all([
          axiosClient.get(`/api/orders/table/${tableNumber}/active`),
          axiosClient.get("/api/products"),
        ]);
        setOrder(orderRes.data);
        setMenu(menuRes.data);
      } catch {
        alert("Không tìm thấy đơn hàng cho bàn này!");
        navigate("/menu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tableNumber, navigate]);

  const handleSelect = (product) => {
    const existing = selectedItems.find((i) => i.productId === product.id);
    if (existing) {
      setSelectedItems(
        selectedItems.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setSelectedItems([...selectedItems, { productId: product.id, quantity: 1 }]);
    }
  };

  const handleAddItems = async () => {
    if (!order) return;
    try {
      await axiosClient.put(`/api/orders/${order.id}/add-items`, selectedItems);
      alert("Thêm món thành công!");
      window.location.reload();
    } catch {
      alert("Lỗi khi thêm món!");
    }
  };


  if (loading) return <p className="text-center mt-5">Đang tải đơn hàng...</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-center mb-4">🍽️ Đơn hàng bàn số {tableNumber}</h2>

      {order ? (
        <>
          {/* ✅ Danh sách món hiện có */}
          <h5>🧾 Danh sách món đã gọi:</h5>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Tên món</th>
                <th>Số lượng</th>
                <th>Giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toLocaleString()} ₫</td>
                  <td>{(item.price * item.quantity).toLocaleString()} ₫</td>
                </tr>
              ))}
              <tr className="fw-bold">
                <td colSpan="3">Tổng cộng</td>
                <td>{order.totalPrice.toLocaleString()} ₫</td>
              </tr>
            </tbody>
          </table>

          {/* ✅ Chọn thêm món */}
          <h5 className="mt-4">➕ Thêm món mới:</h5>
          <div className="row">
            {menu.map((p) => (
              <div key={p.id} className="col-md-3 mb-3">
                <div
                  className="card p-3 shadow-sm"
                  role="button"
                  onClick={() => handleSelect(p)}
                >
                  <h6>{p.name}</h6>
                  <p className="text-muted mb-0">{p.price.toLocaleString()} ₫</p>
                </div>
              </div>
            ))}
          </div>

          {selectedItems.length > 0 && (
            <div className="text-center mt-3">
              <button onClick={handleAddItems} className="btn btn-success me-2">
                ✅ Xác nhận thêm món
              </button>
              <button onClick={() => setSelectedItems([])} className="btn btn-secondary">
                ❌ Hủy chọn
              </button>
            </div>
          )}

          {/* ✅ Nút quay lại menu */}
          <div className="text-center mt-4">
            <button className="btn btn-outline-danger" onClick={handleLogout}>
                🚪 Đăng xuất
            </button>
          </div>
        </>
      ) : (
        <p className="text-center text-muted">Không có đơn hàng nào đang hoạt động.</p>
      )}
    </div>
  );
}

export default MyOrder;
