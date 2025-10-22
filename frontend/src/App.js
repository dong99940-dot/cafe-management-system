import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Tables from "./pages/admin/Tables";
import Orders from "./pages/admin/Orders";
import Feedbacks from "./pages/admin/Feedbacks";
import AdminLayout from "./components/AdminLayout";
import Menu from "./pages/user/Menu";
import ThankYou from "./pages/user/ThankYou";
import MyOrder from "./pages/user/MyOrder";
import OrderHistory from "./pages/user/OrderHistory"
import NotFound from "./pages/user/Notfound";
import ProtectedRoute from "./components/ProtectedRoute";
import Users from "./pages/admin/Users";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "ROOT"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="tables" element={<Tables />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="feedbacks" element={<Feedbacks />} />
        </Route>

        {/* User pages */}
        <Route path="/menu" element={<Menu />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/my-order" element={<MyOrder />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
