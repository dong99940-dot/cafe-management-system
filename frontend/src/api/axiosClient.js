import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      alert("Không thể kết nối đến máy chủ. Kiểm tra lại kết nối mạng.");
      return Promise.reject(error);
    }

    // 401 → Token sai hoặc hết hạn
    if (response.status === 401) {
      const msg = response.data?.error || "Phiên đăng nhập đã hết hạn.";
      alert(msg + " Vui lòng đăng nhập lại.");
      localStorage.clear();
      window.location.href = "/login";
    }

    // 403 → Tài khoản bị khóa hoặc không có quyền
    else if (response.status === 403) {
      const msg = response.data?.error || "Bạn không có quyền truy cập.";
      alert(msg);
      localStorage.clear();
      window.location.href = "/login";
    }

    // Các lỗi khác
    else if (response.status >= 500) {
      alert("Lỗi máy chủ. Vui lòng thử lại sau.");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
