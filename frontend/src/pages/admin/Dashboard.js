import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết cho ChartJS
ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function Dashboard() {
  const [report, setReport] = useState(null);

  // 🔹 Gọi API một lần khi component mount
  useEffect(() => {
    axiosClient.get("/api/reports/today").then((res) => setReport(res.data));
  }, []);

  // 🔹 Hiển thị loading nếu chưa có dữ liệu
  if (!report) return <p className="text-center mt-5">Đang tải dữ liệu...</p>;

  // 🔹 Dữ liệu chart
  const data = {
    labels: ["Doanh thu", "Đơn hàng", "Bàn phục vụ", "Khách"],
    datasets: [
      {
        label: "Thống kê hôm nay",
        data: [
          report.totalRevenue,
          report.totalOrders,
          report.servedTables,
          report.customers,
        ],
        backgroundColor: ["#0d6efd", "#198754", "#ffc107", "#dc3545"],
        borderWidth: 1,
      },
    ],
  };

  // 🔹 Cấu hình chart ổn định (ngăn resize nhấp nháy)
  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ thống kê trong ngày",
        font: { size: 18 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4 text-center">📊 Thống kê hôm nay</h2>

      {/* Cards thống kê nhanh */}
      <div className="row text-center mb-5">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white p-3 shadow-sm">
            <h5>Doanh thu</h5>
            <p className="fs-4">{report.totalRevenue.toLocaleString()} ₫</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white p-3 shadow-sm">
            <h5>Đơn hàng</h5>
            <p className="fs-4">{report.totalOrders}</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-dark p-3 shadow-sm">
            <h5>Bàn sử dụng</h5>
            <p className="fs-4">{report.servedTables}</p>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-danger text-white p-3 shadow-sm">
            <h5>Khách phục vụ</h5>
            <p className="fs-4">{report.customers}</p>
          </div>
        </div>
      </div>

      {/* Biểu đồ bar */}
      <div
        className="card shadow p-4"
        style={{
          height: "400px",
          minHeight: "350px",
        }}
      >
        <Bar data={data} options={options} redraw={false} />
      </div>
    </div>
  );
}

export default Dashboard;
