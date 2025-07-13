import React, { useEffect, useState } from 'react';
import { FiSearch, FiChevronDown, FiEye, FiCheck, FiArrowLeft } from 'react-icons/fi';
import '../../../assets/css/Dashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) {
          alert('Vui lòng đăng nhập lại');
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:3000/api/v1/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.orders)) {
          console.log('Orders data:', JSON.stringify(data.orders, null, 2));
          setOrders(data.orders);
        } else {
          console.error('Lỗi khi tải đơn hàng:', data.message);
          alert('Lỗi khi tải đơn hàng');
        }
      } catch (error) {
        console.error('Lỗi kết nối:', error);
        alert('Không thể kết nối đến máy chủ');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/v1/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert(`Đã cập nhật trạng thái đơn hàng thành ${newStatus}!`);
      } else {
        alert(`Có lỗi xảy ra: ${data.message || 'Vui lòng thử lại sau'}`);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      alert('Có lỗi xảy ra khi kết nối đến máy chủ');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (order.customer?.fullName || order.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.email || order.user?.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'Đang chờ';
      case 'confirmed': return 'Đã xác nhận';
      case 'shipped': return 'Đang giao';
      case 'delivered': return 'Đã giao';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const getActionText = (status: string) => {
    switch(status) {
      case 'pending': return 'Xác nhận';
      case 'confirmed': return 'Đang giao';
      case 'shipped': return 'Đã giao';
      default: return '';
    }
  };

  const getNextStatus = (status: string) => {
    switch(status) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'shipped';
      case 'shipped': return 'delivered';
      default: return status;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="orders-management p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft className="text-gray-600" size={20} />
            </button>
            <h2 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm đơn hàng, tên hoặc email khách hàng..."
                className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Đang chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="shipped">Đang giao hàng</option>
                <option value="delivered">Đã giao hàng</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FiChevronDown className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  const actionText = getActionText(order.status);
                  
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-blue-600">
                        #{order.order_number}
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer?.fullName || order.user?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {order.customer?.email || order.user?.email || 'Chưa cập nhật'}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                        {order.products?.length || 0} sản phẩm
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(order.total_price || 0).toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              console.log('Navigating to order ID:', order._id);
                              console.log('Order Data:', JSON.stringify(order, null, 2));
                              navigate(`/orders/${order._id}`, { state: { order } });
                            }}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                          >
                            <FiEye className="mr-1" /> Chi tiết
                          </button>
                          {actionText && nextStatus && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order._id, nextStatus)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <FiCheck className="mr-1" /> {actionText}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <FiSearch className="mx-auto text-gray-400 h-12 w-12" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      Không tìm thấy đơn hàng
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm 
                        ? `Không có đơn hàng nào phù hợp với "${searchTerm}"`
                        : 'Không có đơn hàng nào phù hợp với bộ lọc của bạn'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length > 10 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Hiển thị 1-10 trong tổng số {filteredOrders.length} đơn hàng
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600">Trước</button>
              <button className="px-3 py-1 rounded-md bg-blue-600 text-white">1</button>
              <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600">2</button>
              <button className="px-3 py-1 rounded-md bg-gray-100 text-gray-600">Sau</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;