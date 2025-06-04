import React from 'react';

const newsList = [
  {
    id: 1,
    title: "Vú sữa Lò Rèn là đặc sản của tỉnh nào?",
    image: "https://via.placeholder.com/120x80?text=Ảnh"
  },
  {
    id: 2,
    title: "Những ‘đặc sản’ khiến khách Tây mê mẩn khi đến Đà Nẵng",
    image: "https://via.placeholder.com/120x80?text=Ảnh"
  },
  {
    id: 3,
    title: "Gạo lứt bao nhiêu calo? Gạo lứt có tốt cho sức khỏe",
    image: "https://via.placeholder.com/120x80?text=Ảnh"
  },
  {
    id: 4,
    title: "Vú sữa Lò Rèn là đặc sản của tỉnh nào?",
    image: "https://via.placeholder.com/120x80?text=Ảnh"
  },
  {
    id: 5,
    title: "Những ‘đặc sản’ khiến khách Tây mê mẩn khi đến Đà Nẵng",
    image: "https://via.placeholder.com/120x80?text=Ảnh"
  },
  {
    id: 6,
    title: "Gạo lứt bao nhiêu calo? Gạo lứt có tốt cho sức khỏe",
    image: "https://via.placeholder.com/120x80?text=Ảnh"
  },
];

const NewsPage: React.FC = () => {
  return (
    <div style={{ background: '#fff', padding: 24, minHeight: '100vh' }}>
      <h1 style={{ marginBottom: 24 }}>Tin tức</h1>
      <div>
        {newsList.map(news => (
          <div key={news.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 24, background: '#eee', padding: 12 }}>
            <div style={{ width: 120, height: 80, background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginRight: 24 }}>
              <img src={news.image} alt="Ảnh" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 500 }}>{news.title}</div>
          </div>
        ))}
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

export default NewsPage;