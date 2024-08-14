"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./styles.css";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import banner1 from "../../../../public/bgImg/banner1.png";
import banner2 from "../../../../public/bgImg/banner2.png";
import banner3 from "../../../../public/bgImg/banner3.png";
import banner4 from "../../../../public/bgImg/banner4.png";
import banner5 from "../../../../public/bgImg/banner5.png";

export default function Banner() {
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        pagination={{
          clickable: true
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper xl:w-full xl:h-[688px]"
      >
        <SwiperSlide>
          <div className="xl:w-full xl:h-[800px] relative">
            <Image src={banner1} alt="mainImg" fill sizes="1280px" priority className="object-contain" />
          </div>
          {/* <div className="xl:w-[1920px] relative">
            <Image src={banner1} alt="mainImg" width={1920} height={688} className="object-contain" />
          </div> */}
        </SwiperSlide>
        <SwiperSlide>
          <div className="xl:w-full xl:h-[800px] relative">
            <Image src={banner2} alt="mainImg" fill sizes="1280px" priority className="object-contain" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="xl:w-full xl:h-[800px] relative">
            <Image src={banner3} alt="mainImg" fill sizes="1280px" priority className="object-contain" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="xl:w-full xl:h-[800px] relative">
            <Image src={banner4} alt="mainImg" fill sizes="1280px" priority className="object-contain" />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <Link href={"/influencer"}>
            <div className="xl:w-full xl:h-[800px] relative">
              <Image src={banner5} alt="mainImg" fill sizes="1280px" priority className="object-contain" />
            </div>
          </Link>
        </SwiperSlide>
      </Swiper>
    </>
  );
}
