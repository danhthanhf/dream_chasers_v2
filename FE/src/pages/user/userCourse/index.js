import React, { memo, useEffect, useState } from "react";
import clsx from "clsx";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as userApi from "../../../api/apiService/authService";
import Footer from "../../../layout/footer";

function Badge({ children }) {
    return (
        <div className="flex justify-center px-2.5 py-1 bg-white rounded-md border border-gray-500 border-solid text-xs ">
            {children}
        </div>
    );
}
export const CourseCard = memo(
    ({ course, textBtn = "Go to learn", courseId = -1 }) => {
        return (
            <div className="course-card w-full col-lg-3 px-4 flex flex-col mb-7">
                <div className="b-shadow bg-white rounded-xl border border-gray-100 p-6 flex flex-col">
                    <div className="flex justify-center">
                        <img
                            loading="lazy"
                            src={course.thumbnail}
                            alt=""
                            className="course-image w-full max-h-28 rounded-t-lg mb-4  object-cover"
                        />
                    </div>
                    <div className="flex justify-start space-x-2 mb-2">
                        {course.categories.map((category) => (
                            <Badge key={category.id}>{category.name}</Badge>
                        ))}
                    </div>
                    <h3 className="text-base font-semibold text-neutral-800 mb-3 line-clamp-2  text-start min-h-12">
                        {course.title}
                    </h3>

                    <Link
                        to={`/course/detail/${course.id}`}
                        className="px-4 py-2 text-xs sm:text-sm font-medium text-center rounded-md border border-gray-100 bg-neutral-100 text-neutral-800"
                    >
                        {textBtn}
                    </Link>
                </div>
            </div>
        );
    }
);

const MyCourses = () => {
    const user = useSelector((state) => state.login.user);
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await userApi.getCoursesOfUser(user.email);
                let listCourse = [];
                result.content?.forEach((pro) => {
                    listCourse.push(pro);
                });
                setCourses(listCourse);
            } catch (error) {
                console.log(error);
            }
        };

        fetchApi();
    }, []);

    return (
        <div>
            <div className={clsx("bg-[#2d2f31] text-white pt-12 pb-5")}>
                <div className="container">
                    <h1 className={clsx("uppercase font-extrabold")}>
                        My Learning
                    </h1>
                </div>
            </div>
            <div className={clsx("container mt-6")}>
                <div className="row">
                    {courses?.length > 0 ? (
                        courses.map((course, ind) => (
                            <CourseCard
                                key={ind}
                                course={course}
                                courseId={course.id}
                            />
                        ))
                    ) : (
                        <div className="text-lg font-semibold">
                            You have not enroll for any courses yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
