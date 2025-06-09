import React from 'react';
import '../../assets/css/Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">TESLA</div>
        <nav className="menu">
          <a className="active">Báo cáo</a>
          <a>Library</a>
          <a>Quản lí người dùng</a>
          <a>Quản lí sản phẩm</a>
          <a>Thêm sản phẩm</a>
          <a>Thêm người dùng</a>
          <a>Quản lí bài viết</a>
          <a>Quản lí danh mục</a>
          <a>Gian hàng hợp tác</a>
        </nav>
        <div className="footer">
          <div>Hỗ trợ</div>
          <div>Cài đặt</div>
          <div>hoang123@gmail.com</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <h1>Thống kê</h1>

        <div className="filters">
          <select>
            <option>Từ trước tới nay</option>
          </select>
          <select>
            <option>Người: All</option>
          </select>
          <select>
            <option>Mặt hàng: Tất cả</option>
          </select>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <p>Users</p>
            <h3>27/80</h3>
          </div>
          <div className="stat-card">
            <p>Questions Answered</p>
            <h3>3,298</h3>
          </div>
          <div className="stat-card">
            <p>Number of Reviews</p>
            <h3>5,000</h3>
          </div>
          <div className="stat-card">
            <p>Tổng doanh thu</p>
            <h3>2,000,000 VND</h3>
          </div>
          <div className="stat-card">
            <p>Mức tăng trưởng</p>
            <h3>3%</h3>
          </div>
          <div className="stat-card">
            <p>Đơn hàng chờ</p>
            <h3>2,000</h3>
          </div>
        </div>

        <div className="lower-grid">
          <div className="panel">
            <h4>Top sản phẩm</h4>
            <p>Food Safety - 74%</p>
            <p>Compliance Basics - 52%</p>
            <p>Networking - 36%</p>
          </div>
          <div className="panel">
            <h4>Chủ đề hot</h4>
            <p>Trái cây - 95%</p>
            <p>Quà lưu niệm - 92%</p>
            <p>Đồ ăn khô - 89%</p>
          </div>
          <div className="panel">
            <h4>Bảng xếp hạng</h4>
            <p>A - 637 pts - 98%</p>
            <p>B - 627 pts - 96%</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
