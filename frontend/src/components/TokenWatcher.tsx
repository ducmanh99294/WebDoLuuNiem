// src/components/TokenWatcher.tsx
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import refreshAccessToken from './refreshAccessToken';
import { TokenExpiredModal } from './PaymentSuccess'; // import modal

const INACTIVITY_LIMIT = 5 * 60 * 1000;
const REFRESH_COOLDOWN = 60 * 1000;

const isTokenExpiringSoon = (token: string, bufferSeconds = 60): boolean => {
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    const exp = payload.exp * 1000;
    return exp - Date.now() < bufferSeconds * 1000;
  } catch {
    return true;
  }
};

export const TokenWatcher = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const lastActiveTimeRef = useRef(Date.now());
  const lastRefreshTimeRef = useRef(0);

  const token = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refreshToken');
  const shouldRun = Boolean(token && refreshToken);

  useEffect(() => {
    if (!shouldRun) return;

    const updateLastActive = async () => {
      lastActiveTimeRef.current = Date.now();
      const now = Date.now();

      // Nếu gần hết hạn và đã qua cooldown
      if (
        isTokenExpiringSoon(token!) &&
        now - lastRefreshTimeRef.current > REFRESH_COOLDOWN
      ) {
        const success = await refreshAccessToken();
        lastRefreshTimeRef.current = now;
        if (!success) {
          setShowModal(true);   // hiện modal thay vì alert
        }
      }
    };

    const checkInactivity = () => {
      if (Date.now() - lastActiveTimeRef.current > INACTIVITY_LIMIT) {
        setShowModal(true);     // hiện modal nếu không hoạt động
      }
    };

    const events = ['mousemove', 'keydown', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, updateLastActive));
    const interval = setInterval(checkInactivity, 10 * 1000);

    return () => {
      clearInterval(interval);
      events.forEach(e => window.removeEventListener(e, updateLastActive));
    };
  }, [navigate, shouldRun, token]);

  const handleConfirm = () => {
    localStorage.clear();
    setShowModal(false);
    navigate('/login');
  };

  return showModal ? <TokenExpiredModal onConfirm={handleConfirm} /> : null;
};
