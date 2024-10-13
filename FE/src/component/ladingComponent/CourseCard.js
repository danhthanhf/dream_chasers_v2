import Ink from "react-ink";
import React, { useState, memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as dataApi from "../../api/apiService/dataService.js";
import { useSelector } from "react-redux";
import * as userApi from "../../api/apiService/authService.js";
import { toast } from "sonner";
import { Button } from "@nextui-org/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Navigation, Pagination, Scrollbar } from "swiper/modules";

export const CourseCard = memo(({ course, courseId = -1 }) => {
    const user = useSelector((state) => state.login.user);
    const navigate = useNavigate();
    const handleGoToCourse = () => {
        if (user) {
            const fetchApi = async () => {
                try {
                    const result = await userApi.getListCourse(user.email);
                    let isEnroll = false;
                    result.content.forEach((progress) => {
                        if (progress.course.id === courseId) {
                            isEnroll = true;
                            navigate(`/course/detail/${courseId}`);
                        }
                    });
                    if (!isEnroll) {
                        navigate(`/course/${courseId}`);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
        } else {
            toast.info("Please login to enroll this course");
            sessionStorage.setItem("prevPath", window.location.pathname);
            navigate("/login");
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
                <div className="px-2 py-[20px]">
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
                            {course && course.totalDuration}
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
                    <div className="font-semibold text-sm mt-3.5 text-black line-clamp-2">
                        {course && course.title + " "}
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Optio molestiae officia itaque
                    </div>
                    <div className="mt-6 flex justify-between">
                        <div className="font-semibold text-base">
                            {course && course.price === 0
                                ? "Free"
                                : course.price + " VNĐ"}
                        </div>
                        <Button
                            className="bg-black rounded-lg text-white font-bold text-sm px-3"
                            size="sm"
                            onClick={handleGoToCourse}
                        >
                            Join
                        </Button>
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
                const result = await dataApi.getAllCourse(0, 999);
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
                    <h2 className="text-xl font-semibold">Featured Course</h2>
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
                                className="w-5 h-5"
                            >
                                <path
                                    fill="#637381"
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
                                className="w-5 h-5"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#637381"
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
                    modules={[Navigation, Pagination, Scrollbar, A11y]}
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
