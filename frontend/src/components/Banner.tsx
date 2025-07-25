import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import "../assets/css/baner.css";
import { FaPaperPlane } from "react-icons/fa";
const Banner = () => {
  const swiperModules = [Autoplay, Pagination, Navigation];
  const slides = [
    "/images/slider_dac-san-ngon-da-nang.png",
    "/images/dac-san-da-nang-mua-lam-qua.jpg ",
    "/images/4-237.jpg",
  ];

  return (
    <div className="banner-container">
      <Swiper
        modules={swiperModules}
        autoplay={{ delay: 1200 }}
        loop={true}
        pagination={{ clickable: true }}
        navigation
      >
        {slides.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="baner-img"
              style={{
                backgroundImage: `url('${img}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                height: "500px",
                position: "relative",
              }}
            >
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-between px-6 md:px-16">
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
