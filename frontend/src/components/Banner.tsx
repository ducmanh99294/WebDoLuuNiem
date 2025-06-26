import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../assets/css/baner.css";
import { FaPaperPlane } from "react-icons/fa";
const Banner = () => {
  const slides = [
    "/images/slider_dac-san-ngon-da-nang.png",
    "/images/baner1.png",
    "/images/slider3.png",
  ];

  return (
    <div className="banner-container">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
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
                <div className="Text-big">
                  <div className="text">
                    <h2 className="Text-chu">Đặc Sản </h2>
                    <p className="text-p">Save up to 50% off on your first order!</p>
                    <div className="text-input">
                      <div className="icon"><FaPaperPlane /></div>
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none w-2/3"
                      />
                      <button>Subscribe</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
