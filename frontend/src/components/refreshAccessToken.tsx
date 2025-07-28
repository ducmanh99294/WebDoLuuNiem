const refreshAccessToken = async (): Promise<boolean> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken || refreshToken.trim() === '') return false;

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
      console.log('[REFRESH TOKEN] Gửi yêu cầu làm mới token...');
      console.log('[REFRESH TOKEN] ✅ Token được làm mới');
      return true;
    } else {
      localStorage.clear();
      return false;
    }
  } catch {
    localStorage.clear();
    return false;
  }
};

export default refreshAccessToken;