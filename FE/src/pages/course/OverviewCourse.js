import Ink from "react-ink";
import React, { useEffect, useState } from "react";
import styles from "./Course.module.scss";
import clsx from "clsx";
import * as publicService from "../../api/apiService/publicService";
import * as userService from "../../api/apiService/userService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import * as ultis from "../../util/index";
import icMail from "../../assets/images/ic-mail.svg";
import { toast } from "sonner";
import { userSelector } from "../../redux/selector";
import * as utils from "../../util/index";

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
                            "mr-5 max-sm:mr-2 flex gap-2 text-sm"
                        )}
                    >
                        <div>{item.lessons.length} lectures</div> {" |"}
                        <div>
                            {ultis.convertSecondsToTime(item?.totalDuration)}
                        </div>
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
                                "flex mx-6 gap-6 py-2 max-sm:text-sm items-center justify-between"
                            )}
                        >
                            <div className="flex items-center gap-2">
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
                            <span className="text-gray-600">
                                {ultis.convertSecondsToTime1(lesson?.duration)}
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

function OverviewCourse() {
    const user = useSelector(userSelector);
    var { title } = useParams();
    title = decodeURIComponent(title).replace(/-/g, " ");
    const [course, setCourse] = useState(initCourse);
    const [totalLessons, setTotalLessons] = useState(0);
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.login.user);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                let response;
                if (user) {
                    response =
                        await userService.checkEnrollmentAndRetrieveCourse(
                            title
                        );
                    if (response.enrolled)
                        navigate(
                            "/course/" + utils.formatStringInUrl(course.title)
                        );
                } else {
                    response = await publicService.getCourseById(title);
                }
                const sections = response.sections;
                let total = 0;

                sections.forEach((section) => {
                    total += section.lessons.length;
                });
                setTotalLessons(total);
                setCourse(response);
            } catch (error) {
                return error.message;
            }
        };
        fetchApi();
    }, [title]);

    const handleEnrollCourse = (id) => {
        if (userInfo === null) {
            sessionStorage.setItem("prevPath", window.location.pathname);
            navigate("/login");
            return;
        }
        if (course.enrolled) {
            navigate("/course/" + utils.formatStringInUrl(course.title));
            return;
        } else {
            navigate(
                `/course/${utils.formatStringInUrl(course.title)}/payment`
            );
        }
    };

    return (
        <div className={clsx(styles.detailsContainer, "container")}>
            <div
                className={clsx(
                    styles.courseCard,
                    "lg:p-7 max-sm:p-4 md:pl-8 md:pr-16 mb-10 text-black"
                )}
            >
                <div className={clsx("grid grid-cols-10")}>
                    <div
                        className={clsx(
                            "px-6 py-6 rounded-lg lg:col-span-7 md:col-span-10 sm:col-span-10 b-shadow-light"
                        )}
                    >
                        <div className={clsx("md:mt-4")}>
                            <div className={clsx(styles.courseInfo)}>
                                {course.status === "REJECTED" && (
                                    <div className="flex tagRejected justify-center items-center mb-3">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="size-6"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
                                            />
                                        </svg>
                                        <span className="ml-2 inline-block italic">
                                            This course was rejected
                                        </span>{" "}
                                    </div>
                                )}
                                <h2
                                    className={clsx(
                                        "text-2xl font-bold mb-[20px]"
                                    )}
                                >
                                    {course.title}
                                </h2>
                                <div className="flex gap-7 items-center text-sm w-full">
                                    <div className="flex gap-1 items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            className="w-[20px] h-[20px]"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="#ffab00"
                                                d="M17.56 21a1 1 0 0 1-.46-.11L12 18.22l-5.1 2.67a1 1 0 0 1-1.45-1.06l1-5.63l-4.12-4a1 1 0 0 1-.25-1a1 1 0 0 1 .81-.68l5.7-.83l2.51-5.13a1 1 0 0 1 1.8 0l2.54 5.12l5.7.83a1 1 0 0 1 .81.68a1 1 0 0 1-.25 1l-4.12 4l1 5.63a1 1 0 0 1-.4 1a1 1 0 0 1-.62.18"
                                            ></path>
                                        </svg>
                                        <span className="font-semibold">
                                            3.6
                                        </span>
                                        <span className="hover:underline text-[#637381] text-sm">
                                            (234 reviews)
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            className="w-[20px] h-[20px]"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                cx="9.001"
                                                cy="6"
                                                r="4"
                                                fill="#00b8d9"
                                            ></circle>
                                            <ellipse
                                                cx="9.001"
                                                cy="17.001"
                                                fill="#00b8d9"
                                                rx="7"
                                                ry="4"
                                            ></ellipse>
                                            <path
                                                fill="#00b8d9"
                                                d="M21 17c0 1.657-2.036 3-4.521 3c.732-.8 1.236-1.805 1.236-2.998c0-1.195-.505-2.2-1.239-3.001C18.962 14 21 15.344 21 17M18 6a3 3 0 0 1-4.029 2.82A5.7 5.7 0 0 0 14.714 6c0-1.025-.27-1.987-.742-2.819A3 3 0 0 1 18 6.001"
                                            ></path>
                                        </svg>
                                        123,124 Students
                                    </div>
                                    <div className="text-sm">
                                        <div
                                            className={clsx(
                                                "flex gap-1 items-center"
                                            )}
                                        >
                                            <span className="text-gray-500 font-normal">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-[20px] h-[20px] rotate-90"
                                                    x="0"
                                                    y="0"
                                                    version="1.1"
                                                    viewBox="0 0 52 52"
                                                >
                                                    <path
                                                        d="M41.085 2.002a1 1 0 0 0-1 1v4.141a3.145 3.145 0 0 1-3.141 3.142h-.56a3.145 3.145 0 0 1-3.142-3.142 5.147 5.147 0 0 0-5.14-5.14h-.305a5.147 5.147 0 0 0-5.141 5.14v.358l-12.341 9.377c-.25.19-.4.48-.4.79v31.33c0 .56.45 1 1 1h25.48c.55 0 1-.44 1-1v-31.33c0-.31-.14-.6-.39-.79l-12.35-9.383v-.352a3.145 3.145 0 0 1 3.142-3.14h.304a3.145 3.145 0 0 1 3.141 3.14 5.147 5.147 0 0 0 5.141 5.142h.561a5.147 5.147 0 0 0 5.141-5.142v-4.14a1 1 0 0 0-1-1zm-12.42 18.616c0 2.76-2.25 5.01-5.01 5.01s-5.01-2.25-5.01-5.01a5.022 5.022 0 0 1 4.01-4.91v4.908a1 1 0 0 0 2 0v-4.907a5.022 5.022 0 0 1 4.01 4.909z"
                                                        fill="#dd1515"
                                                    ></path>
                                                </svg>
                                            </span>
                                            {course &&
                                                course.categories &&
                                                course.categories.length > 0 &&
                                                course.categories.map(
                                                    (ca, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className={clsx(
                                                                    "text-sm border-1 bg-gray-200 text-gray-700 transition-all hover:bg-gray-300 rounded-lg px-2"
                                                                )}
                                                            >
                                                                {ca}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                        </div>
                                    </div>
                                </div>
                                <div className="border-1 border-gray-300 border-dashed my-10"></div>
                                <div className="text-sm grid grid-cols-2 gap-4">
                                    <div className="flex gap-3 col-span-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            className="w-[20px] h-[20px]"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"
                                            ></path>
                                            <path
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                d="M22 12c0-.839 0-1.585-.013-2.25H2.013C2 10.415 2 11.161 2 12v2c0 3.771 0 5.657 1.172 6.828S6.229 22 10 22h4c3.771 0 5.657 0 6.828-1.172S22 17.771 22 14zm-8 .25A1.75 1.75 0 0 0 12.25 14v2a1.75 1.75 0 1 0 3.5 0v-2A1.75 1.75 0 0 0 14 12.25m0 1.5a.25.25 0 0 0-.25.25v2a.25.25 0 1 0 .5 0v-2a.25.25 0 0 0-.25-.25m-3.213-1.443a.75.75 0 0 1 .463.693v4a.75.75 0 0 1-1.5 0v-2.19l-.22.22a.75.75 0 0 1-1.06-1.06l1.5-1.5a.75.75 0 0 1 .817-.163"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <div>
                                            <div className="text-gray-500 mb-1">
                                                Available
                                            </div>
                                            <div className="font-semibold">
                                                21 Oct 2024
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 col-span-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            className="w-[20px] h-[20px]"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M7.75 2.5a.75.75 0 0 0-1.5 0v1.58c-1.44.115-2.384.397-3.078 1.092c-.695.694-.977 1.639-1.093 3.078h19.842c-.116-1.44-.398-2.384-1.093-3.078c-.694-.695-1.639-.977-3.078-1.093V2.5a.75.75 0 0 0-1.5 0v1.513C15.585 4 14.839 4 14 4h-4c-.839 0-1.585 0-2.25.013z"
                                            ></path>
                                            <path
                                                fill="currentColor"
                                                fillRule="evenodd"
                                                d="M22 12c0-.839 0-1.585-.013-2.25H2.013C2 10.415 2 11.161 2 12v2c0 3.771 0 5.657 1.172 6.828S6.229 22 10 22h4c3.771 0 5.657 0 6.828-1.172S22 17.771 22 14zm-8 .25A1.75 1.75 0 0 0 12.25 14v2a1.75 1.75 0 1 0 3.5 0v-2A1.75 1.75 0 0 0 14 12.25m0 1.5a.25.25 0 0 0-.25.25v2a.25.25 0 1 0 .5 0v-2a.25.25 0 0 0-.25-.25m-3.213-1.443a.75.75 0 0 1 .463.693v4a.75.75 0 0 1-1.5 0v-2.19l-.22.22a.75.75 0 0 1-1.06-1.06l1.5-1.5a.75.75 0 0 1 .817-.163"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <div>
                                            <div className="text-gray-500 mb-1">
                                                Author
                                            </div>
                                            <div className="font-semibold">
                                                {course?.author?.firstName +
                                                    " " +
                                                    course?.author?.lastName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 col-span-1">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            role="img"
                                            className="w-[20px] h-[20px]"
                                            viewBox="0 0 24 24"
                                        >
                                            <defs>
                                                <mask id="iconifyReact38">
                                                    <g fill="none">
                                                        <path
                                                            fill="#fff"
                                                            d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
                                                        ></path>
                                                        <path
                                                            fill="#000"
                                                            fillRule="evenodd"
                                                            d="M12 7.25a.75.75 0 0 1 .75.75v3.69l2.28 2.28a.75.75 0 1 1-1.06 1.06l-2.5-2.5a.75.75 0 0 1-.22-.53V8a.75.75 0 0 1 .75-.75"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </g>
                                                </mask>
                                            </defs>
                                            <path
                                                fill="currentColor"
                                                d="M0 0h24v24H0z"
                                                mask="url(#iconifyReact38)"
                                            ></path>
                                        </svg>
                                        <div>
                                            <div className="text-gray-500 mb-1">
                                                Duration
                                            </div>
                                            <div className="font-semibold">
                                                {totalLessons +
                                                    " lessons - " +
                                                    ultis.convertSecondsToTime(
                                                        course?.totalDuration
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 col-span-1">
                                        <img
                                            className="w-[20px] h-[20px] text-black fill-black"
                                            src={icMail}
                                            alt=""
                                        />
                                        <div>
                                            <div className="text-gray-500 mb-1">
                                                Mail
                                            </div>
                                            <div className="font-semibold">
                                                {course?.author?.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-1 border-gray-300 border-dashed my-10"></div>
                                <h4 className="font-semibold mb-3">
                                    Description
                                </h4>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: course.description,
                                    }}
                                    className={clsx(
                                        "max-sm:text-xs md:text-base text-black"
                                    )}
                                ></div>
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
                    <div
                        className={clsx(
                            "lg:col-span-3 md:col-span-10 sm:col-span-10"
                        )}
                    >
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
                                    <div
                                        className={clsx(
                                            styles.coursePrice,
                                            "font-bold text-2xl text-center"
                                        )}
                                    >
                                        {course.price !== 0
                                            ? course.price.toLocaleString(
                                                  "vi-VN"
                                              ) + " VND"
                                            : "Free Course"}
                                    </div>
                                    {course.status !== "REJECTED" && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEnrollCourse(course?.id)
                                            }
                                            className={clsx(
                                                styles.courseCta,
                                                "w-full"
                                            )}
                                        >
                                            Enroll Now
                                        </button>
                                    )}
                                </div>
                                <div className="bg-gray-200 h-[1px] my-2"></div>
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
                                {course.status !== "REJECTED" && (
                                    <>
                                        <div className="bg-gray-200 h-[1px] my-2"></div>
                                        <div className="flex border-1 border-black my-3">
                                            <input
                                                className="flex-1 px-3 py-2 text-black font-normal outline-none text-sm uppercase"
                                                type="text"
                                                placeholder="Enter Coupon"
                                            />
                                            <button className="bg-black px-2 flex items-center py-1 relative text-white text-center font-semibold transition-all text-sm">
                                                <Ink></Ink>
                                                Apply
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OverviewCourse;
