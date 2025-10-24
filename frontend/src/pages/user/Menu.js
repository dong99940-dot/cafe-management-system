import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Button, Form, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Menu() {
  const [tables, setTables] = useState([]);
  const [products, setProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  useEffect(() => {
    const checkAccount = async () => {
      try {
        await axiosClient.get("/auth/me");
      } catch (err) {
        if (err.response?.status === 403) {
          alert("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
        }
        localStorage.clear();
        navigate("/login");
      }
    };
    checkAccount();
  }, [navigate]);

  useEffect(() => {
    const checkMyActiveTable = async () => {
      try {
        const res = await axiosClient.get("/api/tables/my-active");
        if (res.data && res.data.tableNumber) {
          alert(`⚠️ Bạn đang phục vụ tại bàn số ${res.data.tableNumber}.`);
          navigate(`/my-order?table=${res.data.tableNumber}`);
          return;
        }
      } catch (err) {
        console.error("Lỗi khi kiểm tra bàn:", err);
      }
      fetchData();
    };
    checkMyActiveTable();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [t, p, b] = await Promise.all([
        axiosClient.get("/api/tables/available"),
        axiosClient.get("/api/products"),
        axiosClient.get("/api/reports/top-products?limit=8"),
      ]);
      setTables(t.data);
      setProducts(p.data);
      setBestSellers(b.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu:", err);
    }
  };

  const addToCart = (product) => {
    const exists = cart.find((item) => item.productId === product.id);
    if (exists) {
      setCart(
        cart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          note: "",
        },
      ]);
    }
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((i) =>
          i.productId === id ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i.productId !== id));
  };

  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleOrder = async () => {
    if (!selectedTable) {
      alert("❗ Vui lòng chọn bàn trước khi đặt món!");
      return;
    }
    if (cart.length === 0) {
      alert("🛒 Giỏ hàng trống!");
      return;
    }

    try {
      await axiosClient.post("/api/orders", {
        tableNumber: selectedTable.tableNumber,
        customerEmail: email,
        items: cart.map((c) => ({
          productId: c.productId,
          quantity: c.quantity,
          note: c.note || "",
        })),
      });

      await axiosClient.put(`/api/tables/reserve/${selectedTable.tableNumber}`);

      alert("✅ Đặt món thành công!");
      setCart([]);
      setSelectedTable(null);
      navigate(`/thank-you?table=${selectedTable.tableNumber}`);
    } catch (err) {
      const msg =
        err.response?.data?.error || "Không thể đặt bàn. Vui lòng thử lại sau.";
      alert("⚠️ " + msg);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-center mb-4">🍴 Đặt bàn & Gọi món</h2>

      {/* Danh sách bàn */}
      {!selectedTable && (
        <>
          <h5 className="mb-3">💺 Chọn bàn trống:</h5>
          <div className="row g-3 mb-4">
            {tables.map((t) => (
              <div className="col-6 col-md-3" key={t.id}>
                <div
                  className={`card shadow-sm text-center ${
                    selectedTable?.tableNumber === t.tableNumber
                      ? "border-primary border-3"
                      : ""
                  }`}
                  role="button"
                  onClick={() => setSelectedTable(t)}
                >
                  <div className="card-body">
                    <h5 className="fw-bold">Bàn {t.tableNumber}</h5>
                    <p className="text-muted mb-2">{t.capacity} người</p>
                    <Badge bg="success">Còn trống</Badge>
                  </div>
                </div>
              </div>
            ))}
            {tables.length === 0 && (
              <p className="text-muted text-center">Hiện không có bàn trống.</p>
            )}
          </div>
        </>
      )}

      {/* 🔥 Món bán chạy nhất */}
      {bestSellers.length > 0 && (
        <div className="mb-5">
          <h4 className="fw-bold mb-3">🔥 Món bán chạy nhất</h4>
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "1rem",
              paddingBottom: "0.5rem",
              scrollBehavior: "smooth",
            }}
          >
            {bestSellers.map((p, idx) => (
              <div
                key={idx}
                className="card text-center shadow-sm flex-shrink-0"
                style={{
                  width: "150px",
                  minWidth: "150px",
                  border: "1px solid #eee",
                  borderRadius: "10px",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    background: "#ff4757",
                    color: "white",
                    fontSize: "0.7rem",
                    padding: "2px 6px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                  }}
                >
                  ★ Best
                </span>

                <img
                  src={p.imageUrl || "https://via.placeholder.com/100"}
                  alt={p.name}
                  className="card-img-top"
                  style={{
                    height: "100px",
                    objectFit: "cover",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                />
                <div className="card-body p-2">
                  <h6 className="fw-bold text-truncate">{p.name}</h6>
                  <p className="text-success mb-1">
                    {p.price.toLocaleString()} ₫
                  </p>
                  <small className="text-muted">{p.sold} lượt bán</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu */}
      {selectedTable && (
        <>
          <h5 className="mb-3">📜 Danh sách món:</h5>
          <div className="row g-3">
            {products.map((p) => (
              <div className="col-6 col-md-3" key={p.id}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={p.imageUrl || "https://via.placeholder.com/100"}
                    alt={p.name}
                    className="card-img-top"
                    style={{ height: "120px", objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h6 className="fw-bold">{p.name}</h6>
                    <p className="text-success fw-bold mb-2">
                      {p.price.toLocaleString()} ₫
                    </p>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => addToCart(p)}
                    >
                      ➕ Thêm
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Giỏ hàng */}
          <div className="mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">🛒 Giỏ hàng</h5>
              {cart.length > 0 && (
                <Badge bg="primary" pill style={{ fontSize: "1rem" }}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} món
                </Badge>
              )}
            </div>

            {cart.length > 0 ? (
              <>
                <ul className="list-group mb-3">
                  {cart.map((item) => (
                    <li
                      key={item.productId}
                      className="list-group-item d-flex flex-column"
                    >
                      <div className="d-flex justify-content-between align-items-center w-100">
                        <div>
                          <strong>{item.name}</strong>
                          <div className="text-muted small">
                            {item.price.toLocaleString()} ₫ × {item.quantity} ={" "}
                            {(item.price * item.quantity).toLocaleString()} ₫
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => decreaseQuantity(item.productId)}
                          >
                            −
                          </Button>
                          <span className="fw-bold">{item.quantity}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => addToCart(products.find(p => p.id === item.productId))}
                          >
                            +
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            ❌
                          </Button>
                        </div>
                      </div>

                      {/* ✨ Ghi chú đặc biệt */}
                      <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Ghi chú đặc biệt cho món này (vd: ít đường, không đá...)"
                        className="mt-2"
                        value={item.note || ""}
                        onChange={(e) =>
                          setCart(
                            cart.map((i) =>
                              i.productId === item.productId
                                ? { ...i, note: e.target.value }
                                : i
                            )
                          )
                        }
                      />
                    </li>
                  ))}
                </ul>

                <div className="card bg-light mb-3">
                  <div className="card-body d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">💰 Tổng cộng:</h5>
                    <h4 className="mb-0 text-success fw-bold">
                      {totalPrice.toLocaleString()} ₫
                    </h4>
                  </div>
                </div>

                <Button
                  variant="success"
                  size="lg"
                  className="w-100"
                  onClick={handleOrder}
                >
                  ✅ Gửi đơn hàng
                </Button>
              </>
            ) : (
              <p className="text-muted">Chưa có món nào trong giỏ hàng.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Menu;
