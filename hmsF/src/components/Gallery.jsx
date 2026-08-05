import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function Gallery({images}) {
  return (
            <div className="gallery-section">
                <Swiper
                    modules={[Autoplay]}
                    slidesPerView={5}
                    centeredSlides={true}
                    loop={true}
                    spaceBetween={30}
                    autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    }}
                    className="gallery-swiper"
                >
                    {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img src={img} alt="" />
                    </SwiperSlide>
                    ))}
                </Swiper>
            </div>
  );
}

export default Gallery;