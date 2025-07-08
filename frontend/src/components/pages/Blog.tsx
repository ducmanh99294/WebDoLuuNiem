import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5;
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);
 
  useEffect(()=>{
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/blogs`);
        const data = await res.json();
        
        if(data.success) {
          setBlogs(data.data);
          console.log(data.data)
        }
      } catch (err) {
        console.error('err', err);
      } finally {
        setLoading(false);
      }
    };
    if (blogs) fetchBlog();
  }, [])

  if(loading) return <div>Đang tải tin tức...</div>;
  if(!blogs || blogs.length == 0) return <div>không có tin tức nào.</div>
  return (
    <div style={{ background: '#fff', padding: 24, minHeight: '100vh', maxWidth: 800, margin: '0 auto' }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Tin tức</h1>

      {/* Ảnh cửa hàng */}
      <img
        src="https://noithatmasta.com/uploaded/2021/04/1/thiet-ke-cua-hang-thuc-pham-hvafood-3.jpg"
        alt="Ảnh cửa hàng"
        style={{ width: '100%', height: 'auto', borderRadius: 8, marginBottom: 24 }}
      />

      {/* Tiêu đề phụ */}
      <h1 style={{ fontSize: 30, fontWeight: 600, marginBottom: 12 }}>
        Khám phá tin tức mới nhất từ <span style={{ color: '#1a8f3c' }}>Shop MALL</span>
      </h1>

      {/* Từ khóa */}
      <div style={{ background: '#eee', padding: 12, borderRadius: 6, marginBottom: 24 }}>
        <span style={tagStyle}>#dacsan</span>
        <span style={tagStyle}>#healthy</span>
        <span style={tagStyle}>#khoqua</span>
        <span style={tagStyle}>#quatang</span>
        <span style={tagStyle}>#giamcan</span>
      </div>

      {/* Danh sách bài viết */}
      <div>
        <h3 style={{ fontSize: 18, marginBottom: 16 }}>Các bài viết khác</h3>
        {currentBlogs.map(blog => (
          <Link
            to={`/blog/${blog._id}`}
            key={blog._id}
            onClick={()=> {localStorage.setItem('blogId', blog._id)}}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginBottom: 16,
              background: '#eee',
              padding: 12,
              borderRadius: 6,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'background 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#ddd')}
            onMouseLeave={e => (e.currentTarget.style.background = '#eee')}
          >
            <div
              style={{
                width: 120,
                height: 80,
                marginRight: 16,
                flexShrink: 0,
              }}
            >
              
              <img
                src={Array.isArray(blog.image) ? blog.image[0] : blog.image}
                alt="Ảnh"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 4,
                  display: 'block', // tránh spacing dư thừa do inline element
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', lineHeight: 1.4 }}>
                {blog.title}
              </div>
              <div style={{ fontSize: 16, fontWeight: 400, lineHeight: 1.4, marginTop: 8 }}>
                {blog.description}
              </div>
            </div>
          </Link>

        ))}
      </div>

      {/* Phân trang */}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
  <button
    style={pageButtonStyle}
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    {'<'}
  </button>
  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i + 1}
      style={{
        ...pageButtonStyle,
        background: currentPage === i + 1 ? '#1a8f3c' : '#eee',
        color: currentPage === i + 1 ? '#fff' : '#000',
      }}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}
  <button
    style={pageButtonStyle}
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    {'>'}
  </button>
</div>

      {/* Footer Info */}
      <div
        style={{
          marginTop: 48,
          borderTop: '1px solid #eee',
          paddingTop: 16,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
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
          <img src="https://via.placeholder.com/40" alt="App" />
        </div>
      </div>
    </div>
  );
};

// Tag style
const tagStyle: React.CSSProperties = {
  background: '#ccc',
  padding: '6px 10px',
  borderRadius: 12,
  marginRight: 8,
  fontSize: 14,
  display: 'inline-block',
};

// Page button style
const pageButtonStyle: React.CSSProperties = {
  background: '#eee',
  border: 'none',
  padding: '8px 12px',
  margin: '0 4px',
  borderRadius: 4,
  cursor: 'pointer',
  fontWeight: 600,
};

export default Blog;
