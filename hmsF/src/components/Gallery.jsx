import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function Gallery({images}) {
  return (
            <div className="gallery-section">
            <Swiper
            modules={[Autoplay]}
            loop={true}
            centeredSlides={true}
            spaceBetween={20}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            breakpoints={{
                320: {slidesPerView: 1,spaceBetween: 10,},
                480: {slidesPerView: 2,spaceBetween: 15,},
                768: {slidesPerView: 3,spaceBetween: 20,},
                1024: {slidesPerView: 4,spaceBetween: 30,},
                1280: {slidesPerView: 5, spaceBetween: 50,},}}
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