import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import '../../assets/css/productcard.css';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';

const EventPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimes, setSelectedTimes] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/v1/events');
        const data = await res.json();
        if (data.success) {
          const now = new Date();
          const ongoingEvents = (data.data || []).filter((event: any) => {
            const start = new Date(event.startDate);
            const end = new Date(event.endDate);
            return start <= now && end >= now;
          });
          setEvents(ongoingEvents);
        }
      } catch (err) {
        console.error('Lỗi khi tải sự kiện:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const getBadgeInfo = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > now) return { label: 'Sắp diễn ra', color: 'gray' };
    if (start <= now && end >= now) return { label: 'Đang diễn ra', color: 'green' };
    return { label: 'Đã kết thúc', color: 'red' };
  };

  const groupProductsByTimeSlot = (products: any[]) => {
    const grouped: Record<string, any[]> = {};

    products.forEach((app) => {
      const start = new Date(app.startDate);
      const end = new Date(app.endDate);
      const key = `${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }

      grouped[key].push(app);
    });

    return grouped;
  };

  return (
  <div style={{ maxWidth: '100%', margin: '0 auto', padding: '40px 20px' }}>
    <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>Sự kiện nổi bật</h1>

    {loading ? (
      <p>Đang tải sự kiện...</p>
    ) : events.length === 0 ? (
      <p>Không có sự kiện nào.</p>
    ) : (
      events.map((event) => {
        const badge = getBadgeInfo(event.startDate, event.endDate);
        const isExpired = badge.label === 'Đã kết thúc';
        const grouped = groupProductsByTimeSlot(event.products || []);
        const timeSlots = Object.keys(grouped);
        const selectedTime = selectedTimes[event._id] || timeSlots[0];

        return (
          <div
            key={event._id}
            style={{
              marginBottom: 60,
              opacity: isExpired ? 0.6 : 1,
              filter: isExpired ? 'grayscale(60%)' : 'none',
              transition: 'all 0.3s',
            }}
          >
            <span
              style={{
                backgroundColor: badge.color,
                color: 'white',
                padding: '4px 10px',
                borderRadius: 12,
                fontSize: 13,
                marginBottom: 10,
                display: 'inline-block',
              }}
            >
              {badge.label}
            </span>

            {event.images?.length > 0 && (
              <Swiper
                spaceBetween={10}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                modules={[Pagination, Autoplay]}
                style={{ borderRadius: 8, marginBottom: 16 }}
              >
                {event.images.map((img: string, idx: number) => (
                  <SwiperSlide key={idx}>
                    <img
                        src={
            img.startsWith('http') || img.startsWith('data:image')
              ? img
              : `http://localhost:3001${img}`
          }
                      alt={`event-${idx}`}
                      style={{
                        width: '100%',
                        height: 600,
                        objectFit: 'cover',
                        borderRadius: 8,
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            <h2 style={{ fontSize: '24px', marginBottom: 10 }}>{event.name}</h2>
            <p style={{ color: '#555', marginBottom: 8 }}>{event.description}</p>
            <p style={{ fontStyle: 'italic', color: '#888', marginBottom: 8 }}>
              📍 {event.location} | ⏰{' '}
              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </p>

            {/* Time Slot Bar */}
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginBottom: 20 }}>
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedTimes((prev) => ({ ...prev, [event._id]: slot }))}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 20,
                    backgroundColor: slot === selectedTime ? '#00796b' : '#eee',
                    color: slot === selectedTime ? '#fff' : '#333',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🕒 {slot}
                              <p style={{ fontWeight: 'bold', color: '#d32f2f' }}>
            </p>
                </button>
              ))}
            </div>

            {/* Products by Selected Time */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {(grouped[selectedTime] || []).map((app: any) => {
                const product = app.productId;
                const finalPrice = product.price - (product.price * app.discount) / 100;

                return (
                  <div key={product._id} className="card" style={{ width: 260 }}>
                    <div className="image-wrapper">
                      <Link to={`/product-detail/${product._id}`}>
                        {product?.images?.length > 0 && (
                          <img
                            src={product.images[0].image}
                            alt={product.name}
                            className="image"
                          />
                        )}
                      </Link>
                      <div className="label">Hot</div>
                    </div>

                    <div className="rating-line" style={{ marginTop: 8 }}>
                      <span className="star">{product.rating}</span>
                      <span className="review-count">({product.like_count} đánh giá)</span>
                    </div>

                    <div className="name" style={{ fontWeight: 'bold' }}>{product.name}</div>
                    <div className="provider">By <span className="provider-name">NetFood</span></div>
                    <div className='discount'>{app.discount}%</div>  
                    <div className="price-line">
                      {app.discount > 0 ? (
                        <div>
                          <span className="final-price" style={{ color: 'red', fontWeight: 600 }}>{finalPrice}₫</span>
                          <span className="old-price" style={{ textDecoration: 'line-through', color: '#888', marginLeft: 8 }}>{product.price}₫</span>
                        </div>
                      ) : (
                        <span className="final-price">{product.price}₫</span>
                      )}
                      <span><FaHeart className="heart-icon" /></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })
    )}
  </div>
);

};

export default EventPage;
