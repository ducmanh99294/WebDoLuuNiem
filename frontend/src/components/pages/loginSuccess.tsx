import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function LoginSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const name = searchParams.get('name');
    const avatar = searchParams.get('avatar');
    const role = searchParams.get('role');
    const userId = searchParams.get('user_id');
    console.log('Access Token:', userId);
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken || '');
      localStorage.setItem('username', name || 'Người dùng');
      localStorage.setItem('avatar', avatar || '/images/default-avatar.png');
      localStorage.setItem('role', role?.toLowerCase() || 'user');
      localStorage.setItem('userId', userId || '');

      window.history.replaceState({}, document.title, '/');
      navigate('/');
    } else {
        navigate('/login');
        alert('Đăng nhập thất bại. Vui lòng thử lại.');
    }

  })

  return  <p>Đang xử lý đăng nhập...</p>;
}
