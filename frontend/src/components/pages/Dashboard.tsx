// import  {useState } from "react";
// import { Bar } from "react-chartjs-2";
// import { Store, LogOut, MessageCircle } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend,
// } from "chart.js"
// import "../../assets/css/Dashboard.css";
// import { _descriptors } from "chart.js/helpers";
// import AdminOrders from './admin/AdminOrders';
// import AdminEvents from "./admin/AdminEvents";
// import UserManager from "./admin/userManager";
// import BlogManagement from "./admin/BlogManagement";
// import CouponManagement from "./admin/CouponManagement";
// import CategoryManagement from "./admin/CategoryManagement";
// import ProductManagement from "./admin/ProductManagement";

// ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// const Dashboard = () => {
//   const [userCount, setUserCount] = useState<number>(0);
//   const [activeSection, setActiveSection] = useState('dashboard');
//   const navigate = useNavigate();

//   // đăng xuất 
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//     localStorage.removeItem('userId');
//     navigate('/login');
//   };


// useEffect(() => {
//   const fetchUserCount = async () => {
//     try {

//       const response1 = await fetch("http://localhost:3001/api/v1/users");

//       const token = localStorage.getItem('token');

//       const response2 = await fetch("http://localhost:3001/api/v1/users", {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });


//       const data = await response2.json();
//       console.log("Dữ liệu người dùng:", data);

//       if (Array.isArray(data.data)) {
//         const users = data.data.filter((user: any) => user.role !== "admin");
//         setUserCount(users.length);
//         setUserList(users); // ✅ Đặt ở đây sau khi đã khai báo `users`
//       } else if (typeof data.count === "number") {
//         setUserCount(data.count);
//         setUserList([]); // fallback rỗng nếu không có mảng data
//       } else {
//         setUserCount(0);
//         setUserList([]);
//       }
//     } catch (error) {
//       console.error("Lỗi khi tải danh sách người dùng:", error);
//     }
//   };

//   fetchUserCount();
// }, []);
// useEffect(() => {
//   const fetchProductList = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('http://localhost:3001/api/v1/products', {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       console.log('Danh sách sản phẩm:', data);

//       if (Array.isArray(data.products)) {
//         setProductList(data.products);
//       } else {
//         setProductList([]);
//       }
//     } catch (error) {
//       console.error('Lỗi khi tải danh sách sản phẩm:', error);
//     }
//   };

//   if (activeSection === 'products') {
//     fetchProductList();

//   // Decode adminId từ token
//   const token = localStorage.getItem('token');
//   let adminId = '';
//   if (token) {
//     const decoded: any = jwtDecode(token);
//     adminId = decoded.sub || decoded._id || decoded.id;

//   }

//   const chartData = {
//     labels: [
//       "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
//       "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
//     ],
//     datasets: [
//       {
//         label: "Activity",
//         data: [100, 150, 200, 180, 250, 220, 280, 300, 270, 320, 340, 360],
//         backgroundColor: "#4f46e5",
//         borderRadius: 4,
//       },
//     ],
//   };

//   return (
//     <div className="dashboard">
//       <aside className="sidebar">
//         <div className="sidebar-header">🛒 Cửa Hàng Đặc Sản</div>
//         <nav className="sidebar-menu">
//   <div 
//     onClick={() => setActiveSection('dashboard')} 
//     className={activeSection === 'dashboard' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     📊 Báo cáo
//   </div>

//   <div 
//     onClick={() => setActiveSection('chat')} 
//     className={activeSection === 'chat' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     <MessageCircle size={18}/> Khung chat
//   </div>

//   <div 
//     onClick={() => setActiveSection('users')} 
//     className={activeSection === 'users' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     👥 Quản lý người dùng
//   </div>

//   <div 
//     onClick={() => setActiveSection('products')} 
//     className={activeSection === 'products' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     📦 Quản lý sản phẩm
//   </div>

//   <div 
//   onClick={() => setActiveSection('orders')} 
//   className={activeSection === 'orders' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//   🚚 Quản lý đơn hàng
//   </div>

//   <div 
//     onClick={() => setActiveSection('posts')} 
//     className={activeSection === 'posts' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     📝 Quản lý bài viết
//   </div>

//   <div 
//     onClick={() => setActiveSection('categories')} 
//     className={activeSection === 'categories' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     📁 Quản lý danh mục
//   </div>

//   <div 
//     onClick={() => setActiveSection('coupons')} 
//     className={activeSection === 'coupons' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     🏷️ Quản lý mã khuyến mãi
//   </div>

//   <div 
//     onClick={() => setActiveSection('events')} 
//     className={activeSection === 'events' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     🏷️ quản lí sự kiện
//   </div>

//   <div 
//     onClick={() => setActiveSection('stores')} 
//     className={activeSection === 'stores' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     <Store size={18} /> Gian hàng hợp tác
//   </div>

//   <div 
//     onClick={() => setActiveSection('reviews')} 
//     className={activeSection === 'reviews' ? 'menu-highlight active' : 'menu-highlight'}
//   >
//     <Store size={18} /> Đánh giá sản phẩm
//   </div>

//   <div onClick={handleLogout} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
//     <LogOut size={18} /> Đăng Xuất
//   </div>
// </nav>

//         <div className="sidebar-footer">
//           <div>⚙️ Cài đặt</div>
//           <div className="user-info">Hoang<br />hoang123@gmail.com</div>
//         </div>
//       </aside>

//       <main className="main-content">
//         <h1 className="title">
//           {activeSection === 'dashboard' && '📈 Thống kê'}
//           {activeSection === 'chat' && '💬 Khung chat'}
//           {activeSection === 'chat' && '💬 Khung chat'}
//           {activeSection === 'posts' && '📝 Bài viết'}
//           {activeSection === 'categories' && '📁 Danh mục'}
//           {activeSection === 'coupons' && '🏷️ Mã khuyến mãi'}
//           {activeSection === 'stores' && '🏪 Gian hàng'}
//           {activeSection === 'events' && '🏷️ quản lí sự kiện'}
//           {activeSection === 'products' && '🛒 quản lí sản phẩm'}
//         </h1>

//         {/* Nội dung từng phần */}
// {activeSection === 'dashboard' && (
//           <>
//             <div className="filters">
//               <select><option value="all">Thời gian: Từ trước tới nay</option></select>
//               <select><option value="all">Nhóm Khách Hàng: Tất cả</option></select>
//               <select><option value="all">Mặt hàng: Tất cả</option></select>
//             </div>

//             <div className="n1">
//               <div className="stats-grid">
//                 <StatCard title="Người dùng" value={`${userCount} người`} />
//                 <StatCard title="Câu hỏi" value="3,298" />
//                 <StatCard title="Số lượt đánh giá" value="5,000" />
//                 <StatCard title="Tổng doanh thu" value="2,000,000 VNĐ" />
//                 <StatCard title="Mức tăng trưởng" value="3%" />
//                 <StatCard title="Đơn hàng chờ" value="2,000" />
//               </div>

//               <div className="charts-grid">
//                 <div className="full-span">
//                   <div className="n2">
//                     <h2>Báo cáo </h2>
//                     <select>
//                       <option value="ngay">Ngày</option>
//                       <option value="thang">Tháng</option>
//                       <option value="nam">Năm</option>
//                     </select>
//                   </div>
//                   <Bar data={chartData} />
//                 </div>
//               </div>
//             </div>

//             <br />

//             <div className="n3">
//               <div className="card2">
//                 <h2>Chủ đề hot</h2>
//                 <Progress label="trái cây" percent={95} image="/images/top/Rectangle 2370.png" />
//                 <Progress label="quà lưu niệm" percent={92} image="/images/top/Rectangle 2370.png" />
//                 <Progress label="đồ ăn khô" percent={89} image="/images/top/Rectangle 2370.png" />
//               </div>

//               <div className="bottom-grid">
//                 <div className="card1">
//                   <h2>Top sản phẩm</h2>
//                   <Progress label="Food Safety" percent={74} color="red" />
//                   <Progress label="Compliance Basics Procedures" percent={52} color="yellow" />
//                   <Progress label="Company Networking" percent={36} color="pink" />
//                 </div>
//               </div>
//             </div>

//             <br />
//             <br />

//             <div className="card">
//               <h2>Bảng xếp hạng người dùng</h2>
//               <div className="ranking">
//                 <div>A - 92% Correct <span className="up">▲</span></div>
//                 <div>B - 89% Correct <span className="down">▼</span></div>
//               </div>
//             </div>
//           </>
// )}

//         {/*sẩn phẩm*/}
// {activeSection === 'products' && <ProductManagement />}
//         {/*sự kiện*/}
// {activeSection === 'events' && <AdminEvents />}
//         {/* đơn hàng */}
// {activeSection === 'orders' && <AdminOrders />}
//         {/*tin tức*/}
// {activeSection === 'posts' && <BlogManagement />}
//         {/*người dùng*/}
// {activeSection === 'users' && <UserManager />}
//         {/*danh mục*/}
// {activeSection === 'categories' && <CategoryManagement />}
//         {/*mã giảm giá*/}
// {activeSection === 'coupons' && <CouponManagement />}
//       </main>
//     </div>
//   );
// };

// const StatCard = ({ title, value }: { title: string; value: string }) => (
//   <div className="card12">
//     <div className="card-title">{title}</div>
//     <div className="card-value">{value}</div>
//   </div>
// );

// const Progress = ({
//   label,
//   percent,
//   color = "green",
//   image,
// }: {
//   label: string;
//   percent: number;
//   color?: string;
//   image?: string;
// }) => (
//   <div className="progress-item">
//     <div className="progress-label">
//       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//         {image && (
//           <img
//             src={image}
//             alt={label}
//             style={{
//               width: '20px',
//               height: '20px',
//               borderRadius: '4px',
//               objectFit: 'cover',
//             }}
//           />
//         )}
//         <span>{label}</span>
//       </div>
//       <span>{percent}%</span>
//     </div>
//     <div className="progress-bar">
//       <div
//         className={`progress-fill ${color}`}
//         style={{ width: `${percent}%` }}
//       ></div>
//     </div>
//   </div>
// );

// export default Dashboard;

import  {useState } from "react";
import { Bar } from "react-chartjs-2";
import { Store, LogOut, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"
import "../../assets/css/Dashboard.css";
import { _descriptors } from "chart.js/helpers";
import AdminOrders from './admin/AdminOrders';
import AdminEvents from "./admin/AdminEvents";
import UserManager from "./admin/userManager";
import BlogManagement from "./admin/BlogManagement";
import CouponManagement from "./admin/CouponManagement";
import CategoryManagement from "./admin/CategoryManagement";
import ProductManagement from "./admin/ProductManagement";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  const [userCount, setUserCount] = useState<number>(0);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  // đăng xuất 
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
  <div 
    onClick={() => setActiveSection('dashboard')} 
    className={activeSection === 'dashboard' ? 'menu-highlight active' : 'menu-highlight'}
  >
    📊 Báo cáo
  </div>

  <div 
    onClick={() => setActiveSection('chat')} 
    className={activeSection === 'chat' ? 'menu-highlight active' : 'menu-highlight'}
  >
    <MessageCircle size={18}/> Khung chat
  </div>

  <div 
    onClick={() => setActiveSection('users')} 
    className={activeSection === 'users' ? 'menu-highlight active' : 'menu-highlight'}
  >
    👥 Quản lý người dùng
  </div>

  <div 
    onClick={() => setActiveSection('products')} 
    className={activeSection === 'products' ? 'menu-highlight active' : 'menu-highlight'}
  >
    📦 Quản lý sản phẩm
  </div>

  <div 
  onClick={() => setActiveSection('orders')} 
  className={activeSection === 'orders' ? 'menu-highlight active' : 'menu-highlight'}
  >
  🚚 Quản lý đơn hàng
  </div>

  <div 
    onClick={() => setActiveSection('posts')} 
    className={activeSection === 'posts' ? 'menu-highlight active' : 'menu-highlight'}
  >
    📝 Quản lý bài viết
  </div>

  <div 
    onClick={() => setActiveSection('categories')} 
    className={activeSection === 'categories' ? 'menu-highlight active' : 'menu-highlight'}
  >
    📁 Quản lý danh mục
  </div>

  <div 
    onClick={() => setActiveSection('coupons')} 
    className={activeSection === 'coupons' ? 'menu-highlight active' : 'menu-highlight'}
  >
    🏷️ Quản lý mã khuyến mãi
  </div>

  <div 
    onClick={() => setActiveSection('events')} 
    className={activeSection === 'events' ? 'menu-highlight active' : 'menu-highlight'}
  >
    🏷️ quản lí sự kiện
  </div>

  <div 
    onClick={() => setActiveSection('stores')} 
    className={activeSection === 'stores' ? 'menu-highlight active' : 'menu-highlight'}
  >
    <Store size={18} /> Gian hàng hợp tác
  </div>

  <div 
    onClick={() => setActiveSection('reviews')} 
    className={activeSection === 'reviews' ? 'menu-highlight active' : 'menu-highlight'}
  >
    <Store size={18} /> Đánh giá sản phẩm
  </div>

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
          {activeSection === 'chat' && '💬 Khung chat'}
          {activeSection === 'chat' && '💬 Khung chat'}
          {activeSection === 'posts' && '📝 Bài viết'}
          {activeSection === 'categories' && '📁 Danh mục'}
          {activeSection === 'coupons' && '🏷️ Mã khuyến mãi'}
          {activeSection === 'stores' && '🏪 Gian hàng'}
          {activeSection === 'events' && '🏷️ quản lí sự kiện'}
          {activeSection === 'products' && '🛒 quản lí sản phẩm'}
        </h1>

        {/* Nội dung từng phần */}
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
                    <h2>Báo cáo </h2>
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

            <div className="card">
              <h2>Bảng xếp hạng người dùng</h2>
              <div className="ranking">
                <div>A - 92% Correct <span className="up">▲</span></div>
                <div>B - 89% Correct <span className="down">▼</span></div>
              </div>
            </div>
          </>
)}

        {/*sẩn phẩm*/}
{activeSection === 'products' && <ProductManagement />}
        {/*sự kiện*/}
{activeSection === 'events' && <AdminEvents />}
        {/* đơn hàng */}
{activeSection === 'orders' && <AdminOrders />}
        {/*tin tức*/}
{activeSection === 'posts' && <BlogManagement />}
        {/*người dùng*/}
{activeSection === 'users' && <UserManager />}
        {/*danh mục*/}
{activeSection === 'categories' && <CategoryManagement />}
        {/*mã giảm giá*/}
{activeSection === 'coupons' && <CouponManagement />}
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