import React, { useState, memo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as dataApi from "../../api/apiService/dataService.js";
import { useSelector } from "react-redux";
import * as userApi from "../../api/apiService/authService.js";
import { toast } from "sonner";

function Badge({ keyData, children }) {
    return (
        <div
            key={keyData}
            className="flex justify-center px-2.5 py-1 bg-white rounded-md border border-gray-500 border-solid text-xs "
        >
            {children}
        </div>
    );
}
export const CourseCard = memo(
    ({ course, textBtn = "Get It Now", courseId = -1 }) => {
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
            <div className="max-sm:w-full sm:w-1/2 md:w-1/2 lg:w-1/3 px-4 flex flex-col mb-7">
                <div className="b-shadow bg-white rounded-xl border border-gray-100 p-6 flex flex-col">
                    <div className="flex justify-center">
                        <img
                            src={course.thumbnail}
                            alt=""
                            className="course-image rounded-t-lg mb-4 w-full object-cover"
                            style={{ height: "120px", objectFit: "contain" }}
                        />
                    </div>
                    <div className="flex justify-start mb-2 flex-wrap gap-1.5">
                        {course.categories?.map((category, index) => (
                            <Badge key={index} keyData={category.id}>
                                {category.name}
                            </Badge>
                        ))}
                    </div>
                    <h3 className="text-md max-md:min-h-[72px] max-sm:text-lg line-clamp-3 text-base min-h-12 font-semibold text-neutral-800 mb-2 text-start">
                        {course.title}
                    </h3>
                    <p className="min-h-14 line-clamp-3 text-neutral-600 text-xs sm:text-sm mb-4 text-wrap text-start">
                        {course.description}
                    </p>
                    <button
                        type="button"
                        onClick={handleGoToCourse}
                        className="px-4 py-2 text-xs sm:text-sm font-medium text-center rounded-md border border-gray-100 bg-neutral-100 text-neutral-800"
                    >
                        {textBtn}
                    </button>
                </div>
            </div>
        );
    }
);

const CoursesComponent = () => {
    const [courses, setCourses] = useState();
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCourse(0, 999);
                setCourses(result.content.content);
            } catch (error) {
                console.log("error: " + error);
            }
        };
        fetchApi();
    }, []);
    return (
        <section className="p-4 sm:px-5 sm:py-10 mx-auto lg:max-w-[1200px] max-lg:w-[1200px]">
            <div className="flex flex-wrap justify-center">
                {courses &&
                    courses.map((course, index) => (
                        <CourseCard
                            key={index}
                            course={course}
                            courseId={course.id}
                        />
                    ))}
            </div>
        </section>
    );
};

export default CoursesComponent;
