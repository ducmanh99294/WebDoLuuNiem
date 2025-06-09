import React from "react";
import { Bar } from "react-chartjs-2";
import { Store } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import "../../assets/css/Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const chartData = {
    labels: [
      "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
      "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
    ],
    datasets: [
      {
        label: "Activity",
        data: [100, 150, 200, 180, 250, 220, 280, 300, 270, 320, 340, 360],
        backgroundColor: "#4f46e5",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          🛒 Cửa Hàng Đặc Sản
        </div>
        <nav className="sidebar-menu">
          <div className="menu-highlight">📊 Báo cáo</div>
          <div>📚 Library</div>
          <div>👥 Quản lý người dùng</div>
          <div>📦 Quản lý sản phẩm</div>
          <div>➕ Thêm sản phẩm</div>
          <div>➕ Thêm người dùng</div>
          <div>📝 Quản lý bài viết</div>
          <div>📁 Quản lý danh mục</div>
          <div><Store size={18} /> Gian hàng hợp tác</div>
        </nav>
        <div className="sidebar-footer">
          <div>⚙️ Cài đặt</div>
          <div className="user-info">Hoang<br />hoang123@gmail.com</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="title">📈 Thống kê</h1>

        <div className="filters">
          <select>Thời gian: Từ trước tới nay</select>
          <select>Người: All</select>
          <select>Mặt hàng: Tất cả</select>
        </div>
        <div className="n1">
        <div className="stats-grid">
          <StatCard title="Người dùng" value="27/80" />
          <StatCard title="Câu hỏi" value="3,298" />
          <StatCard title="Số lượt đánh giá" value="5,000" />
          <StatCard title="Tổng doanh thu" value="2,000,000 /VNĐ" />
          <StatCard title="Mức tăng trưởng" value="3%" />
          <StatCard title="Đơn hàng chờ" value="2,000" />
        </div>

        <div className="charts-grid">
          <div className="full-span">
            <h2>Activity</h2>
            <Bar data={chartData} />
          </div>
          </div>
            </div>
          <div className="card">
            <h2>Chủ đề hot</h2>
            <Progress label="trái cây" percent={95} />
            <Progress label="quà lưu niệm" percent={92} />
            <Progress label="đồ ăn khô" percent={89} />
          </div>
        

        <div className="bottom-grid">
          <div className="card">
            <h2>Top sản phẩm</h2>
            <Progress label="Food Safety" percent={74} color="red" />
            <Progress label="Compliance Basics Procedures" percent={52} color="yellow" />
            <Progress label="Company Networking" percent={36} color="pink" />
          </div>
          <div className="card">
            <h2>Bảng xếp hạng người dùng</h2>
            <div className="ranking">
              <div>A - 92% Correct <span className="up">▲</span></div>
              <div>B - 89% Correct <span className="down">▼</span></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="card">
    <div className="card-title">{title}</div>
    <div className="card-value">{value}</div>
  </div>
);

const Progress = ({ label, percent, color = "green" }) => (
  <div className="progress-item">
    <div className="progress-label">
      <span>{label}</span>
      <span>{percent}%</span>
    </div>
    <div className="progress-bar">
      <div
        className={`progress-fill ${color}`}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  </div>
);

export default Dashboard;
