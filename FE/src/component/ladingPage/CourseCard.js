import Ink from "react-ink";
import React, { useState, memo, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import * as publicService from "../../api/apiService/publicService.js";
import * as userService from "../../api/apiService/userService.js";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    A11y,
    Autoplay,
    Navigation,
    Pagination,
    Scrollbar,
} from "swiper/modules";
import { userSelector } from "../../redux/selector.js";
import * as utils from "../../util/index.js";
import { toast } from "sonner";

export const CourseCard = memo(({ course }) => {
    const user = useSelector(userSelector);
    const navigate = useNavigate();
    const price = course?.price?.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
    });

    const handleJoinCourse = async () => {
        if (!user) {
            utils.reLogin();
        } else {
            try {
                const res = await userService.checkEnrollmentAndRetrieveCourse(
                    course?.id
                );
                if (res.enrolled) {
                    navigate(`/course/${utils.formatStringInUrl(course?.id)}`);
                } else {
                    navigate(
                        `/course/overview/${utils.formatStringInUrl(
                            course?.id
                        )}`
                    );
                }
            } catch (error) {
                toast.error(error.message);
            }
        }
    };

    return (
        <div className="rounded-xl b-shadow-light">
            <div className="p-2">
                <div className="rounded-xl overflow-hidden">
                    <img
                        src={course.thumbnail}
                        alt=""
                        className="object-cover w-full h-[200px]"
                    />
                </div>
                <div className="px-2 pt-[20px] pb-3">
                    <div className="flex gap-2 text-xs text-gray-500">
                        <div className="flex gap-1.5 px-2 py-1 rounded-md bg-[#edeff1]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M12 2.75a9.25 9.25 0 1 0 0 18.5a9.25 9.25 0 0 0 0-18.5M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12S17.937 22.75 12 22.75S1.25 17.937 1.25 12M12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                            {course &&
                                utils.convertSecondsToTime(
                                    course.totalDuration
                                )}
                        </div>
                        <div className="flex gap-1.5 px-2 py-1 rounded-md bg-[#edeff1]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    cx="9.001"
                                    cy="6"
                                    r="4"
                                    fill="currentColor"
                                ></circle>
                                <ellipse
                                    cx="9.001"
                                    cy="17.001"
                                    fill="currentColor"
                                    rx="7"
                                    ry="4"
                                ></ellipse>
                                <path
                                    fill="currentColor"
                                    d="M21 17c0 1.657-2.036 3-4.521 3c.732-.8 1.236-1.805 1.236-2.998c0-1.195-.505-2.2-1.239-3.001C18.962 14 21 15.344 21 17M18 6a3 3 0 0 1-4.029 2.82A5.7 5.7 0 0 0 14.714 6c0-1.025-.27-1.987-.742-2.819A3 3 0 0 1 18 6.001"
                                ></path>
                            </svg>
                            {course && course.totalRegister}
                        </div>
                    </div>
                    {/* <div className="flex justify-start my-2 flex-wrap gap-1.5">
                            {course.categories?.map((category, index) => (
                                <Badge key={index} keyData={category.id}>
                                    {category.name}
                                </Badge>
                            ))}
                        </div> */}
                    <div className="font-semibold text-sm mt-3.5 text-black line-clamp-2 min-h-10">
                        {course && course.title + " "}
                    </div>
                    <div className="mt-6 flex justify-between">
                        <div className="font-semibold text-base">
                            {course && price === 0 ? "Free" : price}
                        </div>
                        <div
                            onClick={handleJoinCourse}
                            className="bg-black cursor-pointer relative py-1.5 hover:opacity-80 transition-all rounded-lg text-white font-bold text-sm px-4"
                            size="sm"
                        >
                            <Ink></Ink>
                            Join
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

const CoursesComponent = () => {
    const [courses, setCourses] = useState();
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await publicService.getAllCourse(0, 99);
                setCourses(result.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, []);

    return (
        <>
            <section className="p-4 sm:px-5 sm:py-10 mx-auto lg:max-w-[1200px] max-lg:w-[1200px]">
                <div className="flex justify-between">
                    <Link
                        to="/page/course?search=featured"
                        className="text-xl transition-all relative font-semibold hover:underline hover:opacity-80 cursor-pointer"
                    >
                        #Featured Course
                    </Link>
                    <div className="flex gap-3">
                        <button
                            id="feature-course-prev"
                            type="button"
                            className="rounded-full px-2 flex relative items-center "
                        >
                            <Ink />
                            <svg
                                focusable="false"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className="w-[22px] h-[22px]"
                            >
                                <path
                                    fill="black"
                                    fillRule="evenodd"
                                    d="M15.488 4.43a.75.75 0 0 1 .081 1.058L9.988 12l5.581 6.512a.75.75 0 1 1-1.138.976l-6-7a.75.75 0 0 1 0-.976l6-7a.75.75 0 0 1 1.057-.081"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>

                        <button
                            type="button"
                            id="feature-course-next"
                            className="rounded-full px-2 flex relative items-center"
                        >
                            <Ink />
                            <svg
                                focusable="false"
                                className="w-[22px] h-[22px]"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="black"
                                    fillRule="evenodd"
                                    d="M8.512 4.43a.75.75 0 0 1 1.057.082l6 7a.75.75 0 0 1 0 .976l-6 7a.75.75 0 0 1-1.138-.976L14.012 12L8.431 5.488a.75.75 0 0 1 .08-1.057"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <Swiper
                    spaceBetween={30}
                    modules={[
                        Navigation,
                        Pagination,
                        Scrollbar,
                        A11y,
                        Autoplay,
                    ]}
                    autoplay={{
                        delay: 1500,
                        disableOnInteraction: false,
                    }}
                    slidesPerView={4}
                    className="py-4 px-1"
                    navigation={{
                        nextEl: "#feature-course-next",
                        prevEl: "#feature-course-prev",
                    }}
                >
                    {courses &&
                        courses.map((course, index) => (
                            <SwiperSlide key={index}>
                                <CourseCard
                                    course={course}
                                    courseId={course.id}
                                />
                            </SwiperSlide>
                        ))}
                </Swiper>
            </section>
        </>
    );
};

export default CoursesComponent;
