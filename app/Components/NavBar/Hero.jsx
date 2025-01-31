"use client"
import Image from 'next/image';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function Hero() {
  const slides = [
    {
      image: "/banne4.svg",
      bgColor: "bg-gray-800"
    },
    {
      image: "/banne2.svg",
      bgColor: "bg-gray-800"
    },
    {
      image: "/banne3.svg",
      bgColor: "bg-gray-800"
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 my-4 sm:my-6 lg:my-8">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] rounded-xl sm:rounded-2xl overflow-hidden relative group"
      >
        <style>
          {`
            .swiper-button-prev,
            .swiper-button-next {
              width: 30px !important;
              height: 30px !important;
              background: rgba(255, 255, 255, 0.9) !important;
              border-radius: 50% !important;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
              transition: all 0.3s ease !important;
            }

            @media (min-width: 640px) {
              .swiper-button-prev,
              .swiper-button-next {
                width: 40px !important;
                height: 40px !important;
              }
            }

            @media (min-width: 1024px) {
              .swiper-button-prev,
              .swiper-button-next {
                width: 50px !important;
                height: 50px !important;
              }
            }

            .swiper-button-prev {
              left: 20px !important;
            }

            .swiper-button-next {
              right: 20px !important;
            }

            .swiper-button-prev:hover,
            .swiper-button-next:hover {
              background: #048B9A !important;
              transform: scale(1.1);
            }

            .swiper-button-prev::after,
            .swiper-button-next::after {
              font-size: 18px !important;
              font-weight: bold !important;
              color: #333 !important;
            }

            .swiper-button-prev:hover::after,
            .swiper-button-next:hover::after {
              color: white !important;
            }
          `}
        </style>
        <div className="swiper-button-prev !w-[40px] !h-[40px] sm:!w-[50px] sm:!h-[50px] lg:!w-[60px] lg:!h-[60px] !bg-white !rounded-r-full !left-0 !after:text-black !after:text-base sm:!after:text-xl lg:!after:text-2xl !after:font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="swiper-button-next !w-[40px] !h-[40px] sm:!w-[50px] sm:!h-[50px] lg:!w-[60px] lg:!h-[60px] !bg-white !rounded-l-full !right-0 !after:text-black !after:text-base sm:!after:text-xl lg:!after:text-2xl !after:font-black opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className={`relative w-full h-full ${slide.bgColor}`}>
              <Image
                src={slide.image}
                alt="Slide image"
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                className="object-cover w-full h-full"
                priority={index === 0}
                style={{ objectFit: 'cover' }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
