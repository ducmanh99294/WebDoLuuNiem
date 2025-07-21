import React, { useState } from 'react';
import '../assets/css/Register.css';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, confirmPassword } = formData;

    console.log('👉 Dữ liệu gửi:', formData);

    if (!email || !password || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/v1/auth/register', {
        email,
        password,
      });

      console.log('✅ Phản hồi:', response.data);

      if (response.data.success) {
        alert('Đăng ký thành công!');
        setError('');
        navigate('/login');  // 👉 Chuyển thẳng sang login
      } else {
        setError(response.data.message || 'Đăng ký thất bại.');
      }
    } catch (err: any) {
      console.log('❌ Lỗi:', err.response?.data);
      setError(err.response?.data?.error || 'Có lỗi xảy ra.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Đăng Ký</h2>
        <p>
          <strong>Shop Mall</strong> Đăng nhập hoặc tạo tài khoản
          <span className="highlight"> Chúng Tôi </span>
          phục vụ bạn tốt hơn nhé.
        </p>

        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
        
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />

          <button type="submit" className="btn-login" style={{ marginTop: 12 }}>
            Đăng ký
          </button>

          <div className="links">
            <span>
              Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </span>
          </div>
        </form>

        <div className="divider">Hoặc đăng nhập bằng</div>
        <div className="social-login">
          <a href="https://www.facebook.com/login" target="_blank" rel="noopener noreferrer">
            <button type="button" className="facebook-btn">Facebook</button>
          </a>
          <a href="https://accounts.google.com/signin" target="_blank" rel="noopener noreferrer">
            <button type="button" className="google-btn">Google</button>
          </a>
        </div>
      </div>

      <div className="login-right">
        <img src="/images/bn3.png" alt="Shop Mall" />
      </div>
    </div>
  );
};

export default RegisterPage;
