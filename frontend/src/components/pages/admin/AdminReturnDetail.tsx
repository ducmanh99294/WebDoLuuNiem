import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiArrowLeft, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import '../../../assets/css/AdminReturnDetail.css';

const AdminReturnDetail: React.FC = () => {
  const { returnId } = useParams<{ returnId: string }>();
  const navigate = useNavigate();
  const [returnRequest, setReturnRequest] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchReturnDetail = async () => {
      try {
        if (!token) {
          toast.error('Vui lòng đăng nhập lại');
          navigate('/login');
          return;
        }
        if (!returnId) {
          toast.error('Không tìm thấy ID yêu cầu trả hàng');
          navigate('/admin/orders');
          return;
        }

        const res = await fetch(`http://localhost:3001/api/v1/returns/${returnId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok && data.success && data.data) {
          console.log('Return data:', JSON.stringify(data.data, null, 2));
          setReturnRequest(data.data);
        } else {
          throw new Error(data.message || 'Không thể lấy chi tiết yêu cầu trả hàng');
        }
      } catch (err: any) {
        console.error('Lỗi khi lấy chi tiết yêu cầu trả hàng:', err);
        toast.error(err.message || 'Không thể lấy chi tiết yêu cầu trả hàng');
        navigate('/admin/orders');
      } finally {
        setLoading(false);
      }
    };

    fetchReturnDetail();
  }, [returnId, token, navigate]);

  const handleApproveReturn = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/returns/${returnId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Yêu cầu trả hàng đã được phê duyệt và đơn hàng đã bị hủy!');
        navigate('/admin/orders');
      } else {
        toast.error(`Có lỗi xảy ra: ${data.message || 'Vui lòng thử lại sau'}`);
      }
    } catch (error) {
      console.error('Lỗi khi phê duyệt trả hàng:', error);
      toast.error('Có lỗi xảy ra khi kết nối đến máy chủ');
    }
  };

  const handleRejectReturn = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/v1/returns/${returnId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Yêu cầu trả hàng đã bị từ chối!');
        navigate('/admin/orders');
      } else {
        toast.error(`Có lỗi xảy ra: ${data.message || 'Vui lòng thử lại sau'}`);
      }
    } catch (error) {
      console.error('Lỗi khi từ chối trả hàng:', error);
      toast.error('Có lỗi xảy ra khi kết nối đến máy chủ');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Đang chờ xử lý';
      case 'approved': return 'Đã phê duyệt';
      case 'rejected': return 'Đã từ chối';
      default: return status;
    }
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'wrong_item': return 'Sản phẩm sai';
      case 'damaged': return 'Sản phẩm hỏng';
      case 'not_as_described': return 'Sản phẩm không như mô tả';
      case 'other': return 'Khác';
      default: return reason;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (!returnRequest) return <div>Không tìm thấy yêu cầu trả hàng.</div>;

  return (
    <div className="return-detail-container p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => navigate('/admin/orders')}
          >
            <FiArrowLeft className="text-gray-600" size={20} />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Chi tiết yêu cầu trả hàng</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="box">
            <h4 className="text-lg font-semibold mb-4">Thông tin yêu cầu trả hàng</h4>
            <p><strong>ID yêu cầu:</strong> {returnRequest._id}</p>
            <p><strong>Mã đơn hàng:</strong> {returnRequest.order?.order_number || 'N/A'}</p>
            <p><strong>Trạng thái:</strong> 
              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(returnRequest.status)}`}>
                {getStatusText(returnRequest.status)}
              </span>
            </p>
            <p><strong>Lý do trả hàng:</strong> {getReasonText(returnRequest.reason)}</p>
            <p><strong>Mô tả lỗi:</strong> {returnRequest.description}</p>
            <p><strong>Thời gian tạo:</strong> {new Date(returnRequest.createdAt).toLocaleString('vi-VN')}</p>
          </div>

          <div className="box">
            <h4 className="text-lg font-semibold mb-4">Thông tin khách hàng</h4>
            <p><strong>Họ và tên:</strong> {returnRequest.order?.customer?.fullName || returnRequest.user?.name || 'N/A'}</p>
            <p><strong>Email:</strong> {returnRequest.order?.customer?.email || returnRequest.user?.email || 'N/A'}</p>
            <p><strong>Điện thoại:</strong> {returnRequest.order?.customer?.phone || 'N/A'}</p>
            <p><strong>Địa chỉ:</strong> {returnRequest.order?.shipping?.address || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">Hình ảnh sản phẩm</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {returnRequest.images && returnRequest.images.length > 0 ? (
              returnRequest.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={`http://localhost:3001${image}`}
                  alt={`Product ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))
            ) : (
              <p>Không có hình ảnh.</p>
            )}
          </div>
        </div>

        {returnRequest.status === 'pending' ? (
          <div className="mt-6 flex space-x-4">
            <button
              className="btn btn-green flex items-center"
              onClick={handleApproveReturn}
            >
              <FiCheckCircle className="mr-2" /> Phê duyệt trả hàng
            </button>
            <button
              className="btn btn-red flex items-center"
              onClick={handleRejectReturn}
            >
              <FiXCircle className="mr-2" /> Từ chối trả hàng
            </button>
          </div>
        ) : (
          <div className="mt-6">
            <p className={`text-sm font-medium ${getStatusColor(returnRequest.status)}`}>
              Yêu cầu trả hàng đã được {getStatusText(returnRequest.status).toLowerCase()} bởi admin vào {new Date(returnRequest.processedAt).toLocaleString('vi-VN')}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReturnDetail;