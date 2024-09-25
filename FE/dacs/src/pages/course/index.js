import React, { useEffect, useState } from "react";
import styles from "./Course.module.scss";
import clsx from "clsx";
import * as dataApi from "../../api/apiService/dataService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as userApi from "../../api/apiService/authService";

const CurriculumItem = ({ item, index, isHighlighted }) => {
    const handleOpenSubLesson = (e) => {
        const sub = document.getElementById(index);
        sub.classList.toggle("disabled");
        e.currentTarget.classList.toggle("active");
    };

    return (
        <div
            className={clsx(styles.curriculumItem, {
                [styles.highlighted]: isHighlighted,
            })}
        >
            <div
                className={clsx(styles.title, "flex p-2 w-full")}
                onClick={handleOpenSubLesson}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className={clsx("w-6 h-6 mt-1.5 transform")}
                >
                    <path
                        fillRule="evenodd"
                        d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                    />
                </svg>
                <div
                    className={clsx(
                        styles.curriculumItemTitle,
                        "flex w-full justify-between"
                    )}
                >
                    <div className="w-3/4 line-clamp-2 max-sm:text-sm">
                        {item.title}
                    </div>
                    <div
                        className={clsx(
                            styles.subTitle,
                            "mr-5 max-sm:text-xs max-sm:mr-2"
                        )}
                    >
                        {item.lessons.length} lectures
                    </div>
                </div>
            </div>

            <div
                id={index}
                className={clsx(styles.wrapLesson, "w-full py-2.5 disabled")}
            >
                {item.lessons &&
                    item.lessons.map((lesson, ind) => (
                        <div
                            key={ind}
                            className={clsx(
                                styles.lessonItem,
                                "flex ml-6 gap-6 py-2 max-sm:text-sm items-center"
                            )}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-5 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0 1 18 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0 1 18 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 0 1 6 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5"
                                />
                            </svg>
                            <span className="max-sm:text-xs">
                                {lesson.title}
                            </span>
                        </div>
                    ))}
            </div>
        </div>
    );
};

const initCourse = {
    title: "Web Design Fundamentals",
    description:
        "Learn the fundamentals of web design, including HTML, CSS, and responsive design principles. Develop the skills to create visually appealing and user-friendly websites.",
    thumbnail: "",
    price: "336.000",
    lessons: [
        {
            id: "01",
            title: "Introduction to HTML",
        },
        {
            id: "02",
            title: "Styling with CSS",
        },
        {
            id: "03",
            title: "Introduction to Responsive Design",
        },
        {
            id: "04",
            title: "Design Principles for Web",
        },
        {
            id: "05",
            title: "Building a Basic Website",
        },
        {
            id: "06",
            title: "Introduction to HTML",
        },
        {
            number: "07",
            title: "Introduction to HTML",
        },
    ],
};

function Course() {
    const { id } = useParams();
    const [course, setCourse] = useState(initCourse);
    const [totalLessons, setTotalLessons] = useState(0);
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.login.user);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const data = await dataApi.getCourseById(id);
                const sections = data.content.sections;
                let total = 0;
                sections.forEach((section) => {
                    total += section.lessons.length;
                });
                setTotalLessons(total);
                setCourse(data.content);
            } catch (error) {
                return error.content;
            }
        };
        fetchApi();
    }, [id]);

    const handleEnrollCourse = (id) => {
        if (userInfo === null) {
            sessionStorage.setItem("prevPath", window.location.pathname);
            navigate("/login");
            return;
        }

        const fetchApi = async () => {
            try {
                const result = await userApi.getUserByEmail(userInfo.email);
                let isEnrollCourse = false;
                console.log(result);
                result.content.progresses?.forEach((pro) => {
                    console.log(pro.course.title);
                    if (pro.course.title === course.title) {
                        isEnrollCourse = true;
                    }
                });
                if (course.price !== 0 && !isEnrollCourse) {
                    navigate(`/course/payment/${id}`);
                } else {
                    navigate(`/course/detail/${course.id}`);
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    return (
        <div className={clsx(styles.detailsContainer)}>
            <div
                className={clsx(
                    styles.courseCard,
                    "lg:p-7 max-sm:p-4 md:pl-8 md:pr-16 mb-10"
                )}
            >
                <div className={clsx("row")}>
                    <div
                        className={clsx(
                            styles.courseDetailsWrapper,
                            "col-lg-8 col-md-12 col-sm-12"
                        )}
                    >
                        <div
                            className={clsx(
                                styles.courseHeader,
                                styles.someOtherCondition &&
                                    styles.additionalClass,
                                "md:mt-4"
                            )}
                        >
                            <div
                                className={clsx(
                                    styles.courseInfo,
                                    "max-sm:w-full lg:w-[500px]"
                                )}
                            >
                                <h2
                                    className={clsx(
                                        styles.courseTitle,
                                        "sm:text-base md-text-lg font-semibold mt-4 lg:mt-0"
                                    )}
                                >
                                    {course.title}
                                </h2>
                                <p
                                    className={clsx(
                                        styles.courseDescription,
                                        "max-sm:text-xs md:text-base"
                                    )}
                                >
                                    {course.description}
                                </p>
                            </div>
                        </div>
                        <div className={styles.courseMeta}>
                            <div
                                className={clsx(styles.tags, "max-sm:text-xs")}
                            >
                                Tags:
                                {course &&
                                    course.categories &&
                                    course.categories.length > 0 &&
                                    course.categories.map((ca, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={clsx(
                                                    styles.courseLevel,
                                                    "max-sm:text-xs max-sm:px-2 px-2 text-sm py-1 max-sm:py-1"
                                                )}
                                            >
                                                {ca.name}
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                        <div
                            className={clsx(
                                styles.curriculumTitle,
                                "font-semibold"
                            )}
                        >
                            Curriculum
                        </div>
                        <div className={styles.courseCurriculum}>
                            {course.sections &&
                                course.sections.map((item, index) => (
                                    <CurriculumItem
                                        key={index}
                                        index={index}
                                        item={item}
                                    />
                                ))}
                        </div>
                    </div>
                    <div className={clsx("col-lg-4  col-md-12 col-sm-12")}>
                        <div
                            className={clsx(
                                styles.sticky,
                                " b-shadow rounded-lg md:mx-4"
                            )}
                        >
                            <div className={clsx(styles.courseImages)}>
                                <video
                                    key={course.video}
                                    controls
                                    className="w-full"
                                >
                                    <source
                                        src={course.video}
                                        type="video/mp4"
                                    />
                                </video>
                            </div>
                            <div className={styles.courseDetails}>
                                <div className="my-3">
                                    <div className={clsx(styles.coursePrice)}>
                                        {course.price !== 0
                                            ? "Price: " +
                                              course.price.toLocaleString(
                                                  "vi-VN"
                                              ) +
                                              " VND"
                                            : "Free Course"}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleEnrollCourse(id)}
                                        className={clsx(
                                            styles.courseCta,
                                            "w-full"
                                        )}
                                    >
                                        Enroll Now
                                    </button>
                                </div>
                                <div
                                    className={clsx("text-base font-semibold")}
                                >
                                    This course includes:
                                </div>
                                <div>
                                    <div className={clsx(styles.detailItem)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                                            />
                                        </svg>
                                        <span>
                                            Detailed and in-depth knowledge
                                        </span>
                                    </div>
                                    <div className={clsx(styles.detailItem)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                                            />
                                        </svg>
                                        <span>Dedicated lecturer</span>
                                    </div>
                                    <div className={clsx(styles.detailItem)}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                            />
                                        </svg>
                                        <span>Full lifetime access</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Course;
