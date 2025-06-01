import { FaTags, FaTruck, FaThLarge, FaUndoAlt } from "react-icons/fa";
import "../assets/css/WhyChooseUs.css"; // import file CSS

const benefits = [
  {
    icon: <FaTags className="benefit-icon" />,
    title: "Giá tốt nhất & ưu đãi",
    subtitle: "Giao hàng miễn phí",
  },
  {
    icon: <FaTruck className="benefit-icon" />,
    title: "Giao hàng miễn phí",
    subtitle: "24/7 amazing services",
  },
  {
    icon: <FaThLarge className="benefit-icon" />,
    title: "Mặt hàng đa dạng",
    subtitle: "Mega Discounts",
  },
  {
    icon: <FaUndoAlt className="benefit-icon" />,
    title: "Easy returns",
    subtitle: "Within 30 days",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      <h2 className="section-title">Lý do chọn chúng tôi</h2>
      <div className="benefit-list">
        {benefits.map((item, index) => (
          <div key={index} className="benefit-card">
            <div className="icon-wrapper">{item.icon}</div>
            <div className="benefit-text">
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
