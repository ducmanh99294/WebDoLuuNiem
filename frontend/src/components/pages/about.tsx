import React from 'react';
import '../../assets/css/about.css';
import Banner from '../Banner';

const Home: React.FC = () => {
  return (
    <>
      <Banner />
      <div className="about-page" style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
        <h1>Giới thiệu</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 24, gap: 24 }}>
          {/* Left content */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <p style={{ lineHeight: 1.6 }}>
              Công ty <b style={{ color: '#3BB77E' }}>Shop MALL</b> thành lập kể từ ngày <b>27/12/2020</b>. Công ty chuyên phân phối <b>đặc sản vùng miền ngon</b> và các thực phẩm khô chất lượng, hợp vệ sinh trên toàn quốc để đáp ứng nhu cầu tiêu dùng ngày càng cao của các đối tác, cửa hàng và người tiêu dùng.
              <br /><br />
              Với khẩu hiệu trung thành với <b> chất lượng – uy tín – tận tâm</b>, các sản phẩm đặc sản đến từ Shop MALL mang đậm hương vị truyền thống, được kiểm định an toàn thực phẩm rõ ràng và đảm bảo nguồn gốc xuất xứ minh bạch.
              <br /><br />
              "Hướng tới tầm nhìn sẽ trở thành một trong những nhà phân phối, cung ứng bánh kẹo, thực phẩm đặc sản Việt hàng đầu đến tay người tiêu dùng trong khắp cả nước"
            </p>
          </div>

          {/* Right image */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <img
              src="https://cdn.justfly.vn/1600x1081/media/202108/20/1629426031-dia-diem-mua-dac-san-lam-qua-da-nang.jpg"
              alt="Đặc sản Đà Nẵng"
              style={{ width: '100%', borderRadius: 8 }}
            />
          </div>
        </div>

        {/* Second section with image and content */}
        <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: 48, gap: 24 }}>
          <div style={{ flex: 1, minWidth: 300 }}>
            <img
              src="https://danangbest.com/upload_content/op-10-cua-hang-ban-dac-san-da-nang-4.webp"
              alt="Cửa hàng Shop MALL"
              style={{ width: '100%', borderRadius: 8 }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 300 }}>
            <p style={{ lineHeight: 1.6 }}>
              Sản phẩm của<b style={{ color: '#3BB77E' }}> Shop MALL</b> hiện diện ở khắp các hệ thống bán lẻ hiện đại, siêu thị mini, cửa hàng tiện lợi, các cửa hàng đặc sản cũng như các hội chợ, triển lãm, giúp khách hàng tiếp cận dễ dàng hơn với thực phẩm an toàn và quà tặng từ thiên nhiên.
            </p>
            <br />
            <ul style={{ paddingLeft: 20 }}>
              <li>Siêu thị Little Mart</li>
              <li>Siêu thị City Mart</li>
              <li>Siêu thị Mini Go</li>
              <li>Siêu thị An Mart</li>
              <li>Siêu thị Vinmart</li>
              <li>Hệ thống Mega Market</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Shop MALL luôn nỗ lực không ngừng để đưa sản phẩm đến gần hơn với khách hàng, mang lại trải nghiệm mua sắm tiện lợi, an toàn, đảm bảo <b>"an toàn vệ sinh thực phẩm"</b>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
