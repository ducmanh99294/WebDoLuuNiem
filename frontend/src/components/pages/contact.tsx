import React from 'react';

const Contact: React.FC = () => {
  return (
    <div style={{ background: '#fff', padding: 24 }}>
      <h1>Liên hệ</h1>
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Ảnh giới thiệu Shop */}
        <div style={{ flex: 1 }}>
          <div style={{ background: '#eee', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
            Ảnh giới thiệu Shop
          </div>
          <div style={{ marginTop: 16 }}>
            <div>
              <b>Address:</b> 33 Xô Viết Nghệ Tĩnh, phường Hòa Cường Nam, TP Đà Nẵng
            </div>
            <div>
              <b>SĐT:</b> 0909876266
            </div>
            <div>
              <b>Email:</b> <a href="mailto:Email1th@gmail.com">Email1th@gmail.com</a>
            </div>
          </div>
        </div>
        {/* Google Map */}
        <div style={{ flex: 1 }}>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=33+Xô+Viết+Nghệ+Tĩnh,+Đà+Nẵng&output=embed"
            width="100%"
            height="220"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
      {/* Nội dung giới thiệu */}
      <div style={{ marginTop: 24 }}>
        <h3>Đặc Sản Việt Nam – Hương Vị Độc Đáo Từ Khắp Vùng Miền</h3>
        <p>
          Được hình thành từ những nguyên liệu tự nhiên đặc trưng và cách chế biến tinh tế qua nhiều thế hệ, đặc sản Việt Nam không chỉ là món ăn mà còn là biểu tượng văn hóa, niềm tự hào của từng vùng miền. Tại trang website của cửa hàng, lượt truy cập mỗi ngày từ 63 tỉnh thành trên cả nước đã chứng minh sự yêu thích của thực khách đối với những món đặc sản chính gốc.
        </p>
        <h3>Từ Niềm Đam Mê Ẩm Thực Đến Hệ Thống Phân Phối Chuyên Nghiệp</h3>
        <ul>
          <li>
            Biết được nhu cầu của người tiêu dùng Việt Nam luôn tìm kiếm những sản phẩm chất lượng cao, giữ nguyên bản sắc truyền thống và đạt tiêu chuẩn vệ sinh an toàn thực phẩm, Shop MALL đã ra đời.
          </li>
          <li>
            Xuất thân là một đơn vị sản xuất trực tiếp cung cấp các đặc sản vùng miền từ Bắc chí Nam, từ nổi tiếng như Bò Huế, nem chua Thanh Hóa đến cà phê Buôn Ma Thuột. Trải qua nhiều năm phát triển, đặc sản Vietnam đã mang đến cho người tiêu dùng không những những vị quen thuộc mà còn là trải nghiệm mua sắm tiện lợi, đảm bảo chất lượng hàng đầu.
          </li>
        </ul>
      </div>
      {/* Footer Info */}
      <div style={{ marginTop: 32, borderTop: '1px solid #eee', paddingTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <b>Shop Mall</b>
          <div>Địa chỉ: 33 Xô Viết Nghệ Tĩnh, Đà Nẵng</div>
          <div>SĐT: 0909876266</div>
          <div>Email: Email1th@gmail.com</div>
        </div>
        <div>
          <b>Chính sách của hàng</b>
          <div>Phương thức thanh toán</div>
          <div>Chính sách đổi trả</div>
        </div>
        <div>
          <b>App</b>
          <div>Đăng ký nhận tin</div>
          <div>
            <img src="https://via.placeholder.com/40" alt="App" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;