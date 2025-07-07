
// import React , { useState }from 'react';
// import '../../assets/css/Contact.css'
// const Contact: React.FC = () => {
//    const [formData, setFormData] = useState({
//     title: "",
//     name: "",
//     phone: "",
//     email: "",
//     message: "",
//   });
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target;
//     setFormData({ ...formData, [id]: value });
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     alert("Tin nhắn đã được gửi!");
//     // Gửi dữ liệu về backend tại đây nếu cần
//   };
//   return (
//     <div style={{ background: '#fff', padding: 24 }}>
//       <h1>Liên hệ</h1>
//       <div style={{ display: 'flex', gap: 24 }}>
//         {/* Ảnh giới thiệu Shop */}
//         <div style={{ flex: 1 }}>
//           <div style={{ background: '#eee', height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
//             Ảnh giới thiệu Shop
//           </div>
//           <div style={{ marginTop: 16 }}>
//             <div>
//               <b>Address:</b> 33 Xô Viết Nghệ Tĩnh, phường Hòa Cường Nam, TP Đà Nẵng
//             </div>
//             <div>
//               <b>SĐT:</b> 0909876266
//             </div>
//             <div>
//               <b>Email:</b> <a href="mailto:Email1th@gmail.com">Email1th@gmail.com</a>
//             </div>
//           </div>
//         </div>
//         {/* Google Map */}
//         <div style={{ flex: 1 }}>
//           <iframe
//             title="Google Map"
//             src="https://www.google.com/maps?q=33+Xô+Viết+Nghệ+Tĩnh,+Đà+Nẵng&output=embed"
//             width="100%"
//             height="220"
//             style={{ border: 0 }}
//             allowFullScreen
//             loading="lazy"
//           ></iframe>
//         </div>
//       </div>
//       {/* Nội dung giới thiệu */}
//       <div style={{ marginTop: 24 }}>
//         <h3>Đặc Sản Việt Nam – Hương Vị Độc Đáo Từ Khắp Vùng Miền</h3>
//         <p>
//           Được hình thành từ những nguyên liệu tự nhiên đặc trưng và cách chế biến tinh tế qua nhiều thế hệ, đặc sản Việt Nam không chỉ là món ăn mà còn là biểu tượng văn hóa, niềm tự hào của từng vùng miền. Tại trang website của cửa hàng, lượt truy cập mỗi ngày từ 63 tỉnh thành trên cả nước đã chứng minh sự yêu thích của thực khách đối với những món đặc sản chính gốc.
//         </p>
//         <h3>Từ Niềm Đam Mê Ẩm Thực Đến Hệ Thống Phân Phối Chuyên Nghiệp</h3>
//         <ul>
//           <li>
//             Biết được nhu cầu của người tiêu dùng Việt Nam luôn tìm kiếm những sản phẩm chất lượng cao, giữ nguyên bản sắc truyền thống và đạt tiêu chuẩn vệ sinh an toàn thực phẩm, Shop MALL đã ra đời.
//           </li>
//           <li>
//             Xuất thân là một đơn vị sản xuất trực tiếp cung cấp các đặc sản vùng miền từ Bắc chí Nam, từ nổi tiếng như Bò Huế, nem chua Thanh Hóa đến cà phê Buôn Ma Thuột. Trải qua nhiều năm phát triển, đặc sản Vietnam đã mang đến cho người tiêu dùng không những những vị quen thuộc mà còn là trải nghiệm mua sắm tiện lợi, đảm bảo chất lượng hàng đầu.
//           </li>
//         </ul>
//       </div>
//       <br />
//       <br />
//       {/* Footer Info */}
//        <form className="contact-form" onSubmit={handleSubmit}>
//       <h2>Gửi lời nhắn</h2>

//       <div className="form-group">
//         <label htmlFor="title">Tiêu đề <span className="required">*</span></label>
//         <input type="text" id="title" placeholder="Nhập tiêu đề tin nhắn" required value={formData.title} onChange={handleChange} />
//       </div>

//       <div className="form-group">
//         <label htmlFor="name">Tên <span className="required">*</span></label>
//         <input type="text" id="name" placeholder="Nhập tên của bạn" required value={formData.name} onChange={handleChange} />
//       </div>

//       <div className="row">
//         <div className="form-group">
//           <label htmlFor="phone">Số điện thoại</label>
//           <input type="text" id="phone" placeholder="Nhập SĐT của bạn" value={formData.phone} onChange={handleChange} />
//         </div>
//         <div className="form-group">
//           <label htmlFor="email">Email <span className="required">*</span></label>
//           <input type="email" id="email" placeholder="Nhập Email của bạn" required value={formData.email} onChange={handleChange} />
//         </div>
//       </div>

//       <div className="form-group">
//         <label htmlFor="message">Tin nhắn <span className="required">*</span></label>
//         <textarea id="message" rows={4} placeholder="Nhập nội dung tin nhắn" required value={formData.message} onChange={handleChange}></textarea>
//       </div>

//       <button type="submit">Gửi tin nhắn</button>
//     </form>
//     </div>
//   );
// };

// export default Contact;

import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Contact: React.FC = () => {

import React , { useState }from 'react';
import '../../assets/css/Contact.css'
import { ContactSuccess } from '../PaymentSuccess';


const Contact: React.FC = () => {
  const userId = localStorage.getItem('userId')
  const token = localStorage.getItem('token');
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {e.preventDefault()}
    try{
      if (!token || !userId) {
      alert('Vui lòng đăng nhập để gửi');
      return;
    }

    const contactData = {
      user: userId,
      name: formData.name,
      title: formData.title,
      phone: formData.phone,
      email: formData.email,
      message: formData.message,
    }
      const res = await fetch(`http://localhost:3000/api/v1/contacts`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
        body: JSON.stringify(contactData)
      })
      
      console.log(contactData)
      const data = await res.json();
      if (data.success) {
        setShowSuccess(true);
        console.log(data)
      }
    } catch (err) {
      console.error('error: ', err)
    }
  }


  return (
    <div style={{ background: '#fff', padding: '40px 20px', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 32 }}>Liên hệ</h1>

      {/* Bố cục 2 cột */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
        {/* Cột trái: ảnh + thông tin */}
        <div style={{ flex: '1 1 300px' }}>
          <div
            style={{
              background: '#eee',
              height: 180,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            Ảnh giới thiệu Shop
          </div>

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
            height="220"
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

      <br />
      <br />
      {/* Footer Info */}
       <form className="contact-form"  onSubmit={(e) => handleSubmit(e)}>
      <h2>Gửi lời nhắn</h2>

      <div className="form-group">
        <label htmlFor="title">Tiêu đề <span className="required">*</span></label>
        <input type="text" id="title" placeholder="Nhập tiêu đề tin nhắn" required value={formData.title} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label htmlFor="name">Tên <span className="required">*</span></label>
        <input type="text" id="name" placeholder="Nhập tên của bạn" required value={formData.name} onChange={handleChange} />
      </div>

      <div className="row">
        <div className="form-group">
          <label htmlFor="phone">Số điện thoại</label>
          <input type="text" id="phone" placeholder="Nhập SĐT của bạn" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email <span className="required">*</span></label>
          <input type="email" id="email" placeholder="Nhập Email của bạn" required value={formData.email} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message">Tin nhắn <span className="required">*</span></label>
        <textarea id="message" rows={4} placeholder="Nhập nội dung tin nhắn" required value={formData.message} onChange={handleChange}></textarea>
      </div>

      <button type="submit">Gửi tin nhắn</button>
    </form>
    {showSuccess && <ContactSuccess onClose={() => setShowSuccess(false)} />}

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
