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
      const res = await fetch(`https://be-webdoluuniem.onrender.com/api/v1/contacts`, {
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

export default Contact;