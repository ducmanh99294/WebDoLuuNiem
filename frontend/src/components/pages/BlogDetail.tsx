import { useEffect, useState } from 'react';

const BlogDetail = () => {
  const blogId = localStorage.getItem('blogId');
  const [blog, setBlog] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/blogs/${blogId}`); // Thay link bằng API thật
        const data = await res.json();
       if(data.success) {
        setBlog(data.data);
    }
      } catch (err) {
        console.error('Lỗi khi tải bài viết:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) return <div>Đang tải bài viết...</div>;
  if (!blog) return <div>Không tìm thấy bài viết.</div>;

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>{blog.title}</h1>
      <p style={{ fontSize: 18, color: '#555', marginBottom: 24 }}>{blog.description}</p>

      {Array.isArray(blog.image) && blog.image.length > 0 && (
        <img
          src={blog.image[0]}
          alt={blog.title}
          style={{
            width: '100%',
            maxHeight: 400,
            objectFit: 'cover',
            borderRadius: 8,
            marginBottom: 24,
          }}
        />
      )}

      <div style={{ fontSize: 16, lineHeight: 1.7, color: '#333', whiteSpace: 'pre-line' }}>
        {blog.content}
      </div>
    </div>
  );
};

export default BlogDetail;
