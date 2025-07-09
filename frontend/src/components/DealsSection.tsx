import "../assets/css/Deal.css";
import { useEffect, useState } from "react";
import { dealsData } from "../components/data/dealsData";
import type { Deal } from "../components/data/dealsData";

const DealsSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 4,
    hours: 13,
    minutes: 27,
    seconds: 6,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        const seconds = prev.seconds - 1;
        if (seconds >= 0) return { ...prev, seconds };
        const minutes = prev.minutes - 1;
        if (minutes >= 0) return { ...prev, minutes, seconds: 59 };
        const hours = prev.hours - 1;
        if (hours >= 0) return { ...prev, hours, minutes: 59, seconds: 59 };
        const days = prev.days - 1;
        if (days >= 0)
          return { days, hours: 23, minutes: 59, seconds: 59 };
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="deals-section">
      <div className="deals-header">
        <h2>Deals AND offers</h2>
        <div className="countdown">
          <div><span>{String(timeLeft.days).padStart(2, "0")}</span><p>ngày</p></div>
          <div><span>{String(timeLeft.hours).padStart(2, "0")}</span><p>giờ</p></div>
          <div><span>{String(timeLeft.minutes).padStart(2, "0")}</span><p>phút</p></div>
          <div><span>{String(timeLeft.seconds).padStart(2, "0")}</span><p>giây</p></div>
        </div>
      </div>

      <div className="deal-list">
        {dealsData.map((deal: Deal) => (
          <div className="deal-card" key={deal.id}>
            <img src={deal.image} alt={deal.name} />
            <div className="deal-info">
              <h3>{deal.name}</h3>
              <p className="brand">By <span>{deal.brand}</span></p>
              <div className="price">
                <span className="new">${deal.price.toFixed(2)}</span>
                <span className="old">${deal.oldPrice.toFixed(2)}</span>
              </div>
              <button className="add-btn"> Add</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DealsSection;
