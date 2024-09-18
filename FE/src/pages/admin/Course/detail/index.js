import React, { useEffect, useState } from "react"; // This imports the useState hook
import styles from "../../../course/detail/DetailCourse.module.scss";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import * as dataApi from "../../../../api/apiService/dataService.js";
import logoPage from "../../../../assets/images/logo.png";
import { useSelector } from "react-redux";
import Comment from "../../../../component/comment/index.js";

const CourseHero = ({ video = "", thumbnail }) => {
    let link;
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
        <section className={clsx(styles.courseHero)}>
            {video.startsWith("https://res.cloudinary.com") && video !== "" && (
                <video
                    key={video}
                    controls
                    className={clsx(
                        styles.videoPlayer,
                        "cursor-pointer h-full w-full object-contain bg-black"
                    )}
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
    title: "",
    desc: "",
    price: "",
    thumbnail: "",
    date: "",
    categories: [],
    sections: [],
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

                                    "flex items-center ml-6 gap-3.5",
                                    {
                                        [styles.highlighted]:
                                            lesson.id === isHighlighted,
                                    }
                                )}
                            >
                                <div className="checkbox-wrapper ml-3"></div>
                                <span>{lesson.title}</span>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};
function AdminDetailCourse() {
    const userInfo = useSelector((state) => state.login.user);
    const alias = userInfo.email.split("@")[0];
    const [currentVideoUrl, setCurrentVideoUrl] = useState("");
    const [lessonSelected, setLessonSelected] = useState({
        id: "",
    });
    const [currentProgress, setCurrentProgress] = useState([]);
    const [course, setCourse] = useState(initFormData);
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
                const data = await dataApi.getCourseById(id);
                const course = data.content;
                const lessonFirst = course.sections[0]?.lessons[0];
                const video = lessonFirst?.video;
                const linkVideo = lessonFirst?.linkVideo;
                setLessonSelected(lessonFirst);
                setCourse(course);
                setCurrentVideoUrl(video ? video : linkVideo);
            } catch (error) {
                console.log(error);
            }
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
                    "flex items-center justify-between b-shadow"
                )}
            >
                <Link to={"/"} className={clsx(styles.logoPage)}>
                    <img src={logoPage} alt="" />
                </Link>
                <h5 className="mb-0 text-center">{course.title}</h5>
            </div>
            <main className={clsx(styles.uiUxCourse)}>
                <div className={clsx(styles.sectionVideo, "w-full")}>
                    <div className={clsx("row")}>
                        <div
                            className={clsx(styles.videoContainer, "col-lg-9")}
                        >
                            <CourseHero
                                video={currentVideoUrl}
                                thumbnail={course.thumbnail}
                            />

                            {/* //!------------ NOTE ----------------*/}
                            <button
                                className={clsx(
                                    styles.sectionComment,
                                    "btnLGBT"
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
                                "col-lg-3"
                            )}
                        >
                            <section className={styles.courseSection}>
                                <div className={clsx(styles.sectionHeader)}>
                                    <div className={styles.sectionNumber}>
                                        Curriculum
                                    </div>
                                </div>
                                <div className={styles.courseCurriculum}>
                                    {course.sections &&
                                        course.sections.map(
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
                                                        lessonSelected?.id
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

export default AdminDetailCourse;
