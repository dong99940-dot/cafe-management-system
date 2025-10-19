import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Button, Table } from "react-bootstrap";

function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err);
    }
  };

  const toggleActive = async (id, active) => {
    try {
      await axiosClient.put(`/api/users/${id}/active?active=${!active}`);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi đổi trạng thái:", err);
    }
  };

  const changeRole = async (id, role) => {
    const newRole = role === "USER" ? "ADMIN" : "USER";
    try {
      await axiosClient.put(`/api/users/${id}/role?role=${newRole}`);
      fetchUsers();
    } catch (err) {
      console.error("Lỗi khi đổi vai trò:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">👥 Quản lý người dùng</h2>

      <Table bordered hover className="shadow-sm text-center align-middle">
        <thead className="table-light">
          <tr>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.fullName}</td>
              <td>
                <span
                  className={`badge ${
                    u.role === "ADMIN" ? "bg-danger" : "bg-secondary"
                  }`}
                >
                  {u.role}
                </span>
              </td>
              <td>
                <span
                  className={`badge ${
                    u.active ? "bg-success" : "bg-dark"
                  }`}
                >
                  {u.active ? "Hoạt động" : "Bị khóa"}
                </span>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => changeRole(u.id, u.role)}
                >
                  🔁 Đổi vai trò
                </Button>
                <Button
                  variant={u.active ? "outline-danger" : "outline-success"}
                  size="sm"
                  onClick={() => toggleActive(u.id, u.active)}
                >
                  {u.active ? "🔒 Khóa" : "🔓 Mở khóa"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Users;
