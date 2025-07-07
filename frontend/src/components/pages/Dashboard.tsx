import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Store, LogOut, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import AdminChatComponent from './AdminChatComponent';

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
  const [userList, setUserList] = useState<any[]>([]);
  const [userCount, setUserCount] = useState<number>(0);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();
  const [productList, setProductList] = useState<any[]>([]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  // Decode adminId từ token
  const token = localStorage.getItem('token');
  let adminId = '';
  if (token) {
    const decoded: any = jwtDecode(token);
    adminId = decoded.sub || decoded._id || decoded.id;
  }

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch("http://localhost:3000/api/v1/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Dữ liệu người dùng:", data);

        if (Array.isArray(data.data)) {
          const users = data.data.filter((user: any) => user.role !== "admin");
          setUserCount(users.length);
          setUserList(users);
        } else if (typeof data.count === "number") {
          setUserCount(data.count);
          setUserList([]);
        } else {
          setUserCount(0);
          setUserList([]);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
      }
    };

  fetchUserCount();
}, []);

  useEffect(() => {
  const fetchProductList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/v1/products', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log('Danh sách sản phẩm:', data);

      if (Array.isArray(data.products)) {
        setProductList(data.products);
      } else {
        setProductList([]);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
    }
  };

  if (activeSection === 'products') {
    fetchProductList();
  }
}, [activeSection]);
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
      <aside className="sidebar">
        <div className="sidebar-header">🛒 Cửa Hàng Đặc Sản</div>
        <nav className="sidebar-menu">
          <div onClick={() => setActiveSection('dashboard')} className="menu-highlight">📊 Báo cáo</div>
          <div onClick={() => setActiveSection('chat')}><MessageCircle size={18}/> Khung chat</div>
          <div onClick={() => setActiveSection('users')}>👥 Quản lý người dùng</div>
          <div onClick={() => setActiveSection('products')}>📦 Quản lý sản phẩm</div>
          <div onClick={() => setActiveSection('posts')}>📝 Quản lý bài viết</div>
          <div onClick={() => setActiveSection('categories')}>📁 Quản lý danh mục</div>
          <div onClick={() => setActiveSection('coupons')}>🏷️ Quản lý mã khuyến mãi</div>
          <div onClick={() => setActiveSection('stores')}><Store size={18} /> Gian hàng hợp tác</div>
          <div onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={18} /> Đăng Xuất
          </div>
        </nav>
        <div className="sidebar-footer">
          <div>⚙️ Cài đặt</div>
          <div className="user-info">Hoang<br />hoang123@gmail.com</div>
        </div>
      </aside>

      <main className="main-content">
        <h1 className="title">
          {activeSection === 'dashboard' && '📈 Thống kê'}
          {activeSection === 'products' && '📦 Quản lý sản phẩm'}
          {activeSection === 'posts' && '📝 Bài viết'}
          {activeSection === 'categories' && '📁 Danh mục'}
          {activeSection === 'coupons' && '🏷️ Mã khuyến mãi'}
          {activeSection === 'stores' && '🏪 Gian hàng'}
        </h1>

        {/* Khung chat */}
        {activeSection === 'chat' && (
          <AdminChatComponent
            adminId={adminId}
            onClose={() => setActiveSection('dashboard')}
          />
        )}

        {/* Dashboard chính */}
        {activeSection === 'dashboard' && (
          <>
            <div className="filters">
              <select><option value="all">Thời gian: Từ trước tới nay</option></select>
              <select><option value="all">Nhóm Khách Hàng: Tất cả</option></select>
              <select><option value="all">Mặt hàng: Tất cả</option></select>
            </div>

            <div className="n1">
              <div className="stats-grid">
                <StatCard title="Người dùng" value={`${userCount} người`} />
                <StatCard title="Câu hỏi" value="3,298" />
                <StatCard title="Số lượt đánh giá" value="5,000" />
                <StatCard title="Tổng doanh thu" value="2,000,000 VNĐ" />
                <StatCard title="Mức tăng trưởng" value="3%" />
                <StatCard title="Đơn hàng chờ" value="2,000" />
              </div>

              <div className="charts-grid">
                <div className="full-span">
                  <div className="n2">
                    <h2>Activity</h2>
                    <select>
                      <option value="ngay">Ngày</option>
                      <option value="thang">Tháng</option>
                      <option value="nam">Năm</option>
                    </select>
                  </div>
                  <Bar data={chartData} />
                </div>
              </div>
            </div>

            <br />

            <div className="n3">
              <div className="card2">
                <h2>Chủ đề hot</h2>
                <Progress label="trái cây" percent={95} image="/images/top/Rectangle 2370.png" />
                <Progress label="quà lưu niệm" percent={92} image="/images/top/Rectangle 2370.png" />
                <Progress label="đồ ăn khô" percent={89} image="/images/top/Rectangle 2370.png" />
              </div>

              <div className="bottom-grid">
                <div className="card1">
                  <h2>Top sản phẩm</h2>
                  <Progress label="Food Safety" percent={74} color="red" />
                  <Progress label="Compliance Basics Procedures" percent={52} color="yellow" />
                  <Progress label="Company Networking" percent={36} color="pink" />
                </div>
              </div>
            </div>

            <br />
            <br />

                   {/* Quản lý người dùng */}
        {activeSection === 'users' && (
          <div className="user-management">
            <div className="user-header">
              <button onClick={() => setActiveSection('dashboard')}>Back</button>
              <h2>Quản lí người dùng</h2>
              <button className="add-user">Thêm người dùng</button>
            </div>

            <div className="user-list">
              {userList.map((user) => (
                <div key={user._id} className="user-card0">
                  <div className="user-infor2">
                    <img
                      src={user.avatar || "/images/default-avatar.png"}
                      alt="avatar"
                      className="avatar-img"
                    />
                    <div className="user-details1">
                      <h3 className="user-name1">{user.name}</h3>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>SĐT:</strong> {user.phone}</p>
                      <p><strong>Vai trò:</strong> {user.role}</p>
                      <p><strong>Địa chỉ:</strong> {user.address}</p>
                    </div>
                  </div>
                  <div className="user-actions">
                    <button className="btn-edit">Sửa</button>
                    <button className="btn-delete">Xoá</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quản lý sản phẩm */}

            <div className="card">
              <h2>Bảng xếp hạng người dùng</h2>
              <div className="ranking">
                <div>A - 92% Correct <span className="up">▲</span></div>
                <div>B - 89% Correct <span className="down">▼</span></div>
              </div>
            </div>
          </>
        )}

             {activeSection === 'products' && (
  <div className="sp-section">
    <h2>📦 Quản lý sản phẩm</h2>
    {productList.length === 0 ? (
      <p>Không có sản phẩm nào.</p>
    ) : (
      <div className="sp-list">
        {productList.map((product) => (
          <div key={product._id} className="sp-card">
            <div className="sp-info">
              <img
                src={product.image || "/images/default-product.png"}
                alt={product.name}
                className="sp-img"
              />
              <div className="sp-content">
                <h3 className="sp-name">{product.name}</h3>
                <p><strong>Giá:</strong> {product.price?.toLocaleString()}đ</p>
                <p><strong>Mô tả:</strong> {product.description || 'Không có mô tả'}</p>
                <p><strong>Danh mục:</strong> {product.category?.name || 'Không có'}</p>
              </div>
            </div>
            <div className="sp-actions">
              <button className="sp-btn-edit">Sửa</button>
              <button className="sp-btn-delete">Xoá</button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}
        {/* Các mục khác, ví dụ products */}
        {activeSection === 'products' && (
          <div className="card">
            <h2>Danh sách sản phẩm (demo)</h2>
            <ul>
              <li>Sản phẩm 1 - Giá: 100.000đ</li>
              <li>Sản phẩm 2 - Giá: 150.000đ</li>
              <li>Sản phẩm 3 - Giá: 200.000đ</li>
            </ul>
          </div>
        )}
          {/* Các section khác */}
        {activeSection === 'posts' && <div className="card"><h2>Quản lý bài viết</h2></div>}
        {activeSection === 'categories' && <div className="card"><h2>Quản lý danh mục</h2></div>}
        {activeSection === 'coupons' && <div className="card"><h2>Quản lý mã khuyến mãi</h2></div>}
        {activeSection === 'stores' && <div className="card"><h2>Quản lý gian hàng</h2></div>}
    
      </main>
    </div>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <div className="card12">
    <div className="card-title">{title}</div>
    <div className="card-value">{value}</div>
  </div>
);

const Progress = ({
  label,
  percent,
  color = "green",
  image,
}: {
  label: string;
  percent: number;
  color?: string;
  image?: string;
}) => (
  <div className="progress-item">
    <div className="progress-label">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {image && (
          <img
            src={image}
            alt={label}
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              objectFit: 'cover',
            }}
          />
        )}
        <span>{label}</span>
      </div>
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
