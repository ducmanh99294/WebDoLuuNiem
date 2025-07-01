import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrdersByUser = async (userId: string) => {
      try {
        const res = await fetch(
          `http://localhost:3000/api/v1/orders/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
          console.log(data)
        } else {
          setError(data.message || "Không lấy được đơn hàng");
        }
      } catch (err: any) {
        setError("Lỗi kết nối server");
        console.error("Lỗi khi gọi API lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchOrdersByUser(userId);
  }, [userId]);

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (orders.length === 0) return <div>Không có đơn hàng nào.</div>;

  return (
    <div className="order-list-container" style={{ maxWidth: 800, margin: "auto" }}>
      <h2 style={{ color: "#2f855a", marginBottom: 20 }}>Danh sách đơn hàng</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        <thead style={{ backgroundColor: "#f0fdf4" }}>
          <tr>
            <th style={{ padding: "10px", textAlign: "left" }}>Mã đơn hàng</th>
            <th style={{ padding: "10px", textAlign: "right" }}>Tổng tiền</th>
            <th style={{ padding: "10px", textAlign: "center" }}>Trạng thái</th>
            <th style={{ padding: "10px", textAlign: "center" }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: any) => (
            <tr key={order._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
              <td style={{ padding: "10px" }}>{order.order_number}</td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                {order.total_price.toLocaleString()} VND
              </td>
              <td style={{ padding: "10px", textAlign: "center" }}>{order.status}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>
                <button
                  onClick={() => {
                    localStorage.setItem("orderId", order._id); // Set orderId in localStorage
                    navigate(`/order/${order._id}`);
                  }}
                  style={{
                    backgroundColor: "#38a169",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Xem chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
