import React, { useEffect, useState } from "react"; // This imports the useState hook
import styles from "./DetailCourse.module.scss";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import * as userApi from "../../../api/apiService/authService.js";
import logoPage from "../../../assets/images/logo.png";
import { useSelector } from "react-redux";
import Comment from "../../../component/comment/index.js";

let timerId = null;
const debounce = (func, delay = 1000) => {
    return () => {
        clearTimeout(timerId);
        timerId = setTimeout(() => {
            func();
        }, delay);
    };
};

const CourseHero = ({
    video = "",
    thumbnail,
    aliasEmail,
    lessonId,
    currentProgress,
}) => {
    let link;

    const [duration, setDuration] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const handleLoadedMetadata = (event) => {
        setDuration(event.target.duration);
    };

    const handleTimeUpdate = (event) => {
        const currentTime = event.target.currentTime;
        let newUpdate = currentProgress;
        newUpdate = [...newUpdate, lessonId.id];
        if (currentTime / duration >= 0.65 && !isCompleted) {
            currentProgress.includes(lessonId.id);

            setIsCompleted(true);
            const fetchUpdateLessonIds = async () => {
                try {
                    await userApi.updateLessonIds(
                        aliasEmail,
                        lessonId,
                        newUpdate
                    );
                } catch (error) {
                    console.log(error);
                }
            };
            console.log("Lesson completed!");
        }
    };

    function youtube_parser(url) {
        var regExp =
            /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return match && match[7].length === 11 ? match[7] : false;
    }
    if (!video.startsWith("https://res.cloudinary.com")) {
        link = `https://www.youtube.com/embed/${youtube_parser(video)}`;
    }

    return (
        <section
            className={clsx(styles.courseHero, "lg:h-[550px] max-sm:w-full")}
        >
            {video.startsWith("https://res.cloudinary.com") && video !== "" && (
                <video
                    onTimeUpdate={handleTimeUpdate}
                    key={video}
                    controls
                    className={clsx(
                        styles.videoPlayer,
                        "cursor-pointer h-full w-full object-contain bg-black"
                    )}
                    onLoadedMetadata={handleLoadedMetadata}
                >
                    <source src={video} type="video/mp4" />
                </video>
            )}
            {!video.startsWith("https://res.cloudinary.com") &&
                video !== "" && (
                    <iframe
                        title="Video"
                        src={link}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className={clsx(styles.videoPlayer, "rounded-lg")}
                    ></iframe>
                )}
            {video === "" ? <img src={thumbnail} alt="Course thumbnail" /> : ""}
        </section>
    );
};

const initFormData = {
    course: {
        title: "",
        desc: "",
        price: "",
        thumbnail: "",
        date: "",
        categories: [],
    },
};
const CurriculumItem = ({
    active,
    section,
    aliasEmail,
    sectionId,
    courseId,
    isHighlighted,
    currentProgress,
    handleVideoSelect,
    setCurrentProgress,
}) => {
    const handleOpenSubLesson = (e) => {
        const sub = document.getElementById(`section${sectionId}`);
        sub.classList.toggle("disabled");
        e.currentTarget.classList.toggle(styles.active);
    };
    let newUpdate = currentProgress;

    const handleChecked = (e) => {
        const id = parseInt(e.target.id, 10);
        if (e.target.checked && !currentProgress.includes(id)) {
            newUpdate = [...newUpdate, id];
        } else {
            newUpdate = [...newUpdate.filter((item) => item !== id)];
        }

        setCurrentProgress((prev) => newUpdate);

        const fetchUpdateLessonIds = async () => {
            try {
                await userApi.updateLessonIds(aliasEmail, courseId, newUpdate);
            } catch (error) {
                console.log(error);
            }
        };
        const debounceAPi = debounce(fetchUpdateLessonIds, 500);
        debounceAPi();
    };

    return (
        <div className={clsx(styles.curriculumItem, {})}>
            <div
                className={clsx(
                    styles.title,
                    "flex cursor-pointer p-2 w-full",
                    {
                        [styles.active]: active === 0,
                    }
                )}
                onClick={(e) => handleOpenSubLesson(e)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className={clsx(styles.transfrom, "w-6 h-6 mt-1.5")}
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
                    <div className="w-3/4 line-clamp-2 flex-1">
                        {section.title}
                    </div>
                </div>
            </div>

            <div
                id={`section${sectionId}`}
                className={clsx(styles.wrapLesson, "w-full ", {
                    disabled: active !== 0,
                })}
            >
                {section.lessons &&
                    section.lessons.map((lesson, ind) => {
                        return (
                            <div
                                key={ind}
                                onClick={() => handleVideoSelect(lesson)}
                                className={clsx(
                                    styles.lessonItem,
                                    "flex items-center ml-6 gap-3.5 sm:py-2.5 lg:py-4 md:py-4 py-2 sm:px-2 lg:px-5 md:px-5 w-full",
                                    {
                                        [styles.highlighted]:
                                            lesson.id === isHighlighted,
                                    }
                                )}
                            >
                                <div className="checkbox-wrapper ml-3">
                                    <label>
                                        <input
                                            checked={currentProgress.includes(
                                                lesson.id
                                            )}
                                            id={lesson.id}
                                            type="checkbox"
                                            onChange={handleChecked}
                                        />
                                        <span className="checkbox"></span>
                                    </label>
                                </div>

                                <span>{lesson.title}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
function DetailCourse() {
    const userInfo = useSelector((state) => state.login.user);
    const alias = userInfo.email.split("@")[0];
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");
    const [lessonSelected, setLessonSelected] = useState({
        id: "",
    });
    const [totalLesson, setTotalLesson] = useState(0);
    const [currentProgress, setCurrentProgress] = useState([]);
    const [progressObject, setProgressObject] = useState(initFormData);
    const [openModal, setOpenModal] = useState(false);
    const { id } = useParams();

    const handleCloseComment = () => {
        setOpenModal(false);
    };

    const handleOpenComment = () => {
        setOpenModal(true);
    };

    const handleVideoSelect = (lesson) => {
        if (lesson.video !== "" && lesson.linkVideo === "") {
            setCurrentVideoUrl(lesson.video);
        } else {
            setCurrentVideoUrl(lesson.linkVideo);
        }
        setLessonSelected(lesson);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const data = await userApi.getProgress(alias, id);
                let total = 0;
                const lessonFirst = data.content.course.sections[0].lessons[0];
                const video = lessonFirst.video;
                const linkVideo = lessonFirst.linkVideo;

                data.content.course.sections.map(
                    (section) => (total += section.lessons.length)
                );
                if (data.content.lessonIds !== null) {
                    setCurrentProgress(data.content.lessonIds);
                }

                setLessonSelected(lessonFirst);
                setCurrentVideoUrl(video ? video : linkVideo);
                setProgressObject(data.content);
                setTotalLesson(total);
            } catch (error) {}
        };

        fetchApi();
        if (window.location.pathname.includes("openComment")) {
            setOpenModal(true);
        }
    }, [id, alias]);

    return (
        <div className={clsx(styles.wrapperPage)}>
            <div
                className={clsx(
                    styles.headerPage,
                    "flex items-center justify-between b-shadow max-sm:px-4 px-4 lg:px-[100px] lg:h-[60px] md:px-4"
                )}
            >
                <Link to={"/"} className={clsx(styles.logoPage)}>
                    <img
                        className={clsx(
                            "lg:size-12 size-10 md:size-10 sm:size-8 flex-1"
                        )}
                        src={logoPage}
                        alt=""
                    />
                </Link>
                <h5 className="mb-0 text-center text-xs  sm:text-xs sm:px-2 line-clamp-2 flex-2 md:text-sm md:px-4 px-4">
                    {progressObject.course.title}
                </h5>
                <div
                    className={clsx(
                        "lg:font-semibold lg:text-lg max-sm:text-xs md:text-sm "
                    )}
                >
                    Progress: {currentProgress.length}/{totalLesson}
                </div>
            </div>
            <main className={clsx(styles.uiUxCourse)}>
                <div className={clsx(styles.sectionVideo, "w-full")}>
                    <div className={clsx("row max-sm:flex-row")}>
                        <div
                            className={clsx(
                                styles.videoContainer,
                                "lg:h-screen-60 lg:overflow-y-scroll lg:overflow-x-hidden col-lg-9 col-sm-12 col-md-12"
                            )}
                        >
                            <CourseHero
                                lessonId={lessonSelected}
                                video={currentVideoUrl}
                                thumbnail={progressObject.course.thumbnail}
                            />

                            {/* //!------------ NOTE ----------------*/}
                            <button
                                className={clsx(
                                    styles.sectionComment,
                                    "lg:px-4 lg:right-[26%] right-6 px-2 py-2 bottom-[4%] lg:py-4  text-white bg-black max-sm:px-2 max-sm:py-3 max-sm:right-6 max-sm:bottom-8 btnLGBT max-sm:text-xs rounded-lg md:px-3 md:py-3 md:right-[4%]"
                                )}
                                onClick={handleOpenComment}
                            >
                                <div className="flex gap-2">
                                    Discussion
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                        />
                                    </svg>
                                </div>
                            </button>

                            <div
                                className={clsx(styles.sectionComment)}
                                onClick={handleOpenComment}
                            ></div>
                            {/* //!------------ NOTE ----------------*/}
                        </div>
                        <div
                            className={clsx(
                                styles.courseSectionsContainer,
                                "col-lg-3 col-sm-12 col-md-12 lg:fixed lg:-right-1 lg:top-[60px]"
                            )}
                        >
                            <section className={clsx(styles.courseSection)}>
                                <div className={clsx(styles.sectionHeader)}>
                                    <div
                                        className={clsx(
                                            styles.sectionNumber,
                                            "max-sm:text-base"
                                        )}
                                    >
                                        Curriculum
                                    </div>
                                </div>
                                <div className={styles.courseCurriculum}>
                                    {progressObject.course.sections &&
                                        progressObject.course.sections.map(
                                            (section, index) => (
                                                <CurriculumItem
                                                    active={index}
                                                    setCurrentProgress={
                                                        setCurrentProgress
                                                    }
                                                    courseId={id}
                                                    currentProgress={
                                                        currentProgress
                                                    }
                                                    aliasEmail={alias}
                                                    isHighlighted={
                                                        lessonSelected.id
                                                    }
                                                    handleVideoSelect={
                                                        handleVideoSelect
                                                    }
                                                    sectionId={index}
                                                    key={index}
                                                    section={section}
                                                />
                                            )
                                        )}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
                {openModal && (
                    <Comment
                        courseId={id}
                        lessonId={lessonSelected.id}
                        openModal={openModal}
                        funcCloseModal={handleCloseComment}
                    ></Comment>
                )}
            </main>
        </div>
    );
}

export default DetailCourse;
