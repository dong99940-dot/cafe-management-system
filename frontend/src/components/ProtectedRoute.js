import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" replace />;

  // Nếu có danh sách role được phép, kiểm tra khớp
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/404" replace />;
  }

  return children;
}

export default ProtectedRoute;
