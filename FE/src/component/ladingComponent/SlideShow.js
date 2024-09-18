import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Slideshow.css";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import slideShow1 from "../../assets/images/slideShow1.png";
import slideShow2 from "../../assets/images/slideshow2.png";
import slideShow3 from "../../assets/images/slideshow3.png";
import clsx from "clsx";
import { Link } from "react-router-dom";

const PromoSlideshow = () => {
    const slides = [
        {
            img: slideShow1,
            title: "Study every time and everywhere",
            description: "Lots of useful knowledge, constantly updated",
            path: "/course/2",
            buttonText: "Register Now",
        },
        {
            img: slideShow2,
            title: "ReactJS course is having attractive promotion",
            description:
                "ReactJS course from basic to advanced. The result of this course is that you can do most common projects with ReactJS.",
            path: "/course/2",
            buttonText: "Register Now",
        },
        {
            img: slideShow3,
            title: "Many courses are being updated and discounted",
            description:
                "Quickly register for the course to improve your abilities and find more job opportunities.",
            path: "/course/2",
            buttonText: "Register Now",
        },
    ];

    return (
        <div className="max-w-screen-xl mx-auto">
            <Swiper
                modules={[Pagination, Navigation, Autoplay]}
                spaceBetween={50}
                slidesPerView={1}
                loop={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    renderBullet: (index, className) => {
                        return (
                            '<span className="' +
                            className +
                            ' SwiperBulletcustom"></span>'
                        );
                    },
                }}
                navigation={true}
                className="relative rounded-xl"
                style={{ height: "300px" }}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide
                        key={index}
                        className={clsx("flex items-center justify-between ", {
                            "bg-pink-400": index === 0,
                            "bg-blue-400": index === 1,
                            "bg-orange-400": index === 2,
                        })}
                    >
                        <div className="row">
                            <div className="flex z-10 p-10 text-left text-white w-full md:w-1/2 col-lg-6">
                                <div>
                                    <h2 className="lg:pl-20 lg:min-h-[64px] max-md:px-14 max-sm:px-12 lg:text-2xl md:text-2xl font-bold">
                                        {slide.title}
                                    </h2>
                                    <p className="max-sm:px-12 lg:min-h-[72px] md:px-14 lg:px-20  max-sm:pr-12 my-4 text-sm md:text-base">
                                        {slide.description}
                                    </p>
                                    <Link
                                        to={slide.path}
                                        className="max-lg:ml-20 ml-20 max-sm:ml-12 px-4 py-2 mb-2 text-white bg-purple-500 rounded-full font-medium shadow-lg text-sm md:text-base"
                                    >
                                        {slide.buttonText}
                                    </Link>
                                </div>
                            </div>
                            <div className="md:w-1/2 col-lg-6">
                                <img
                                    src={slide.img}
                                    alt="New feeds"
                                    className="object-cover h-full m-auto pb-5"
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default PromoSlideshow;
