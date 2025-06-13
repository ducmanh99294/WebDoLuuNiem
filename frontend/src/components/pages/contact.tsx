import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact: React.FC = () => {
  return (
    <div style={{ background: '#fff', padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 32 }}>Liên hệ</h1>

      {/* Bố cục 2 cột */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {/* Cột trái: ảnh + thông tin */}
        <div style={{ flex: '1 1 300px' }}>
          
          <img
            src="https://cdn.justfly.vn/1600x1081/media/202108/20/1629426031-dia-diem-mua-dac-san-lam-qua-da-nang.jpg"
            alt="Ảnh giới thiệu shop"
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: 8,
              marginBottom: 16,
              objectFit: 'cover',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <FaMapMarkerAlt style={{ marginRight: 8 }} />
            33 Xô Viết Nghệ Tĩnh, phường Hòa Cường Nam, TP Đà Nẵng
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <FaPhoneAlt style={{ marginRight: 8 }} />
            0909876266
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <FaEnvelope style={{ marginRight: 8 }} />
            <a href="mailto:Email1th@gmail.com">Email1th@gmail.com</a>
          </div>
        </div>

        {/* Cột phải: Google Map */}
        <div style={{ flex: '1 1 300px' }}>
          <iframe
            title="Google Map"
            src="https://www.google.com/maps?q=33+Xô+Viết+Nghệ+Tĩnh,+Đà+Nẵng&output=embed"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: 8 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Nội dung giới thiệu */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ color: '#1a8f3c' }}>Đặc Sản Việt Nam – Hương Vị Độc Đáo Từ Khắp Vùng Miền</h3>
        <p>
          Được hình thành từ những nguyên liệu tự nhiên đặc trưng và cách chế biến tinh tế qua nhiều thế hệ, đặc sản Việt Nam không chỉ là món ăn mà còn là biểu tượng văn hóa, niềm tự hào của từng vùng miền. Tại trang website của cửa hàng, lượt truy cập mỗi ngày từ 63 tỉnh thành trên cả nước đã chứng minh sự yêu thích của thực khách đối với những món đặc sản chính gốc.
        </p>

        <h3 style={{ color: '#1a8f3c' }}>Từ Niềm Đam Mê Ẩm Thực Đến Hệ Thống Phân Phối Chuyên Nghiệp</h3>
        <ul style={{ paddingLeft: 20 }}>
          <li>
            Biết được nhu cầu của người tiêu dùng Việt Nam luôn tìm kiếm những sản phẩm chất lượng cao, giữ nguyên bản sắc truyền thống và đạt tiêu chuẩn vệ sinh an toàn thực phẩm, Shop MALL đã ra đời.
          </li>
          <li>
            Xuất thân là một đơn vị sản xuất trực tiếp cung cấp các đặc sản vùng miền từ Bắc chí Nam, từ nổi tiếng như Bò Huế, nem chua Thanh Hóa đến cà phê Buôn Ma Thuột. Trải qua nhiều năm phát triển, đặc sản Vietnam đã mang đến cho người tiêu dùng không những những vị quen thuộc mà còn là trải nghiệm mua sắm tiện lợi, đảm bảo chất lượng hàng đầu.
          </li>
        </ul>
      </div>

      {/* Gửi lời nhắn */}
      <ContactForm />
    </div>
  );
};

// FORM giống y ảnh bạn yêu cầu
const ContactForm: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: '40px auto 0' }}>
      <h2 style={{ textAlign: 'center', fontSize: '32px', fontWeight: 700, marginBottom: 32 }}>
        Gửi lời nhắn
      </h2>
      <form style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={labelStyle}>
            Tiêu đề <span style={{ color: 'red' }}>*</span>
          </label>
          <input type="text" placeholder="Nhập tiêu đề tin nhắn" style={inputStyle} required />
        </div>

        <div>
          <label style={labelStyle}>
            Tên <span style={{ color: 'red' }}>*</span>
          </label>
          <input type="text" placeholder="Nhập tên của bạn" style={inputStyle} required />
        </div>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <label style={labelStyle}>Số điện thoại</label>
            <input type="tel" placeholder="Nhập số điện thoại của bạn" style={inputStyle} />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <label style={labelStyle}>
              Email <span style={{ color: 'red' }}>*</span>
            </label>
            <input type="email" placeholder="Nhập địa chỉ email của bạn" style={inputStyle} required />
          </div>
        </div>

        <div>
          <label style={labelStyle}>
            Tin nhắn <span style={{ color: 'red' }}>*</span>
          </label>
          <textarea
            placeholder="Nhập nội dung tin nhắn"
            style={{ ...inputStyle, height: 120, resize: 'vertical' }}
            required
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Gửi lời nhắn
        </button>
      </form>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontSize: 16,
  borderRadius: 8,
  border: '1px solid #ddd',
  outline: 'none',
  fontFamily: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: 8,
  fontWeight: 500,
  fontSize: 15,
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: '#FFD3A5',
  color: '#000',
  border: 'none',
  padding: '12px 24px',
  borderRadius: 8,
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
  alignSelf: 'center',
};

export default Contact;
