import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 phút

export const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const res = await fetch('http://localhost:3001/api/v1/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (res.ok && data.accessToken && data.refreshToken) {
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      return true;
    } else {
      console.warn('Làm mới token thất bại:', data.message);
      localStorage.clear();
      return false;
    }
  } catch (err) {
    console.error('Lỗi khi làm mới token:', err);
    localStorage.clear();
    return false;
  }
};

export const useAutoRefreshToken = () => {
  const navigate = useNavigate();
  const lastActiveTimeRef = useRef(Date.now());
  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastActiveTimeRef.current;
      if (inactiveTime > INACTIVITY_LIMIT) {
        alert('Bạn đã không hoạt động trong 5 phút. Vui lòng đăng nhập lại.');
        localStorage.clear();
        navigate('/login');
      }
    };

    const refreshIfNeeded = async () => {
      const success = await refreshAccessToken();
      if (!success) {
        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        localStorage.clear();
        navigate('/login');
      }
    };

    // Sự kiện hoạt động người dùng
    const updateLastActive = () => {
      lastActiveTimeRef.current = Date.now();
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach((e) => window.addEventListener(e, updateLastActive));

    // Kiểm tra mỗi phút
    const interval = setInterval(() => {
      checkInactivity();
      refreshIfNeeded(); // Nếu chưa hết hạn vẫn refresh được
    }, 60 * 1000); // 1 phút
    // Cleanup
    return () => {
      clearInterval(interval);
      events.forEach((e) => window.removeEventListener(e, updateLastActive));
       };
  }, [navigate]);
};
