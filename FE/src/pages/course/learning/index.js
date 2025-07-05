import { Box, CircularProgress, Rating, Typography } from "@mui/material";
import logo from "../../../assets/images/logo.png";
import PopoverComponent from "../../../component/popover";
import Ink from "react-ink";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import * as utils from "../../../util/index";
import { Tab, Tabs } from "@nextui-org/react";
import searchIcon from "../../../assets/images/search.png";
import loadingIcon from "../../../assets/images/loading.png";
import * as userService from "../../../api/apiService/userService";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import InputComponent from "../../../component/InputComponent";
import ModalNoBody from "../../../component/modal/ModalNoBody";
import SelectComponent from "../../../component/select/SelectComponent";
import * as publicService from "../../../api/apiService/publicService";
import PaginationItem from "../../../component/Pagination";
import ReactQuill from "react-quill-new";
import Modal from "../../../component/modal";
import DiscussionTab from "./Discussion";

const LessonItem = ({
    lesson,
    index,
    listProgress,
    selectedLesson,
    onSelectFunc = () => {},
}) => {
    const progress = listProgress.find((p) => p.lessonId === lesson.id);
    const isCompleted = progress?.completed;
    const isLocked = progress?.locked;

    return (
        <div
            key={lesson?.id}
            className={clsx(
                "px-4 py-2 flex text-sm justify-between transition-all cursor-pointer",
                {
                    "bg-[#d1d7dc]":
                        selectedLesson?.progress?.lessonId === lesson?.id,
                    "bg-gray-100 select-none hover:cursor-not-allowed opacity-40":
                        isLocked,
                    "hover:bg-[#d1d7dc]": !isLocked,
                }
            )}
            onClick={() => {
                if (
                    isLocked ||
                    selectedLesson?.progress?.lessonId === lesson.id
                )
                    return;
                let progress = listProgress.find(
                    (p) => p.lessonId === lesson.id
                );

                onSelectFunc({ progress, video: lesson.video });
            }}
        >
            <div>
                {index + ". " + lesson?.title}
                <div className="text-xs mt-2 flex gap-1.5 text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        enableBackground="new 0 0 32 32"
                        viewBox="0 0 32 32"
                        id="video"
                        className="w-4 h-4"
                        strokeWidth={2.5}
                        fill="#6b7280"
                    >
                        <path d="M30,1H2C1.447,1,1,1.448,1,2v28c0,0.552,0.447,1,1,1h28c0.553,0,1-0.448,1-1V2C31,1.448,30.553,1,30,1z M29,9h-4.586l2.293-2.293c0.391-0.391,0.391-1.023,0-1.414L24.414,3H29V9z M16.414,9l2.293-2.293c0.391-0.391,0.391-1.023,0-1.414L16.414,3h5.172l3,3l-3,3H16.414z M8.414,9l2.293-2.293c0.391-0.391,0.391-1.023,0-1.414L8.414,3h5.172l3,3l-3,3H8.414z M5.586,3l3,3l-3,3H3V3H5.586z M3,29V11h26v18H3z"></path>
                        <path d="M20.53,19.152l-8-5c-0.31-0.193-0.698-0.204-1.015-0.026C11.197,14.302,11,14.636,11,15v10c0,0.364,0.197,0.698,0.516,0.875C11.666,25.958,11.833,26,12,26c0.185,0,0.368-0.051,0.53-0.152l8-5C20.822,20.665,21,20.345,21,20S20.822,19.335,20.53,19.152z M13,23.196v-6.392L18.113,20L13,23.196z"></path>
                    </svg>
                    {utils.convertSecondsToTime(lesson?.duration)}
                </div>
            </div>
            <div className="w-[36px] center">
                {isCompleted && (
                    <svg
                        aria-hidden="true"
                        focusable="false"
                        className="w-4 h-4"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                    >
                        <path
                            fill="#5db85c"
                            d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                        ></path>
                    </svg>
                )}
                {isLocked && (
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        enableBackground="new 0 0 512 512"
                        viewBox="0 0 512 512"
                        id="lock"
                        className="w-4 h-4"
                        fill="#6b7280"
                    >
                        <g>
                            <path
                                d="M164.022,131.363c0-50.717,41.262-91.978,91.978-91.978c50.716,0,91.978,41.262,91.978,91.978v70.946H164.022V131.363z
		 M432.88,202.31h-45.52v-70.95C387.36,58.93,328.43,0,256,0S124.64,58.93,124.64,131.36v70.95H79.12
		c-10.88,0-19.69,8.82-19.69,19.69v270.31c0,10.87,8.81,19.69,19.69,19.69h353.76c10.88,0,19.69-8.82,19.69-19.69V222
		C452.57,211.13,443.76,202.31,432.88,202.31z M275.69,395.04v20.84c0,10.87-8.81,19.69-19.69,19.69s-19.69-8.82-19.69-19.69v-20.84
		c-23.34-8.16-40.13-30.39-40.13-56.48c0-32.98,26.83-59.82,59.82-59.82s59.82,26.84,59.82,59.82
		C315.82,364.65,299.03,386.88,275.69,395.04z M256,318.12c-11.27,0-20.44,9.17-20.44,20.44c0,11.27,9.17,20.44,20.44,20.44
		s20.44-9.17,20.44-20.44C276.44,327.29,267.27,318.12,256,318.12z"
                            ></path>
                        </g>
                    </svg>
                )}
            </div>
        </div>
    );
};

const SectionItem = ({
    selectedLesson,
    section,
    listProgress = [],
    index,
    onSelectFunc = () => {},
}) => {
    const [isOpenSection, setOpenSection] = useState(false);

    return (
        <div className="relative" key={section?.id}>
            <div
                className="px-[16px] py-3 bg-[#f7f9fa] flex flex-col gap-1 cursor-pointer border-t-1 border-gray-300"
                onClick={() => setOpenSection(!isOpenSection)}
            >
                <div className="font-bold text-base flex justify-between line-clamp-1">
                    {"Section " + index + ": "}
                    {section?.title}
                    <div
                        className={clsx(
                            "transition-transform transform-gpu duration-300 ease-in-out flex items-center justify-center",
                            {
                                "rotate-180": isOpenSection,
                            }
                        )}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    </div>
                </div>
            </div>
            <div
                className={clsx(
                    "transition-all duration-300 ease-in-out overflow-hidden",
                    {
                        "max-h-0": !isOpenSection,
                        "max-h-[500px] overflow-y-auto": isOpenSection,
                    }
                )}
            >
                {section?.lessons?.map((l, index) => (
                    <LessonItem
                        index={index + 1}
                        listProgress={listProgress}
                        selectedLesson={selectedLesson}
                        onSelectFunc={onSelectFunc}
                        key={l.id}
                        lesson={l}
                    />
                ))}
            </div>
        </div>
    );
};

const Header = ({ myRating, enrollment }) => {
    const [isOpenModal, setOpenModal] = useState(false);
    const [ratingObject, setRatingObject] = useState({
        comment: myRating?.comment || "",
        rating: myRating?.rating || 0,
    });

    useEffect(() => {
        if (myRating) {
            setRatingObject({
                comment: myRating?.comment || "",
                rating: myRating?.rating || 0,
            });
        }
    }, [myRating]);

    const getPercent = Math.round(
        (enrollment.totalCompletedLessons / enrollment.totalLessons) * 100
    );

    const handleRatingCourse = async (e) => {
        e.preventDefault();
        setRatingObject({
            comment: myRating?.comment || "",
            rating: myRating?.rating || 0,
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        if (myRating) {
            setRatingObject({
                comment: myRating?.comment || "",
                rating: myRating?.rating || 0,
            });
        }
    };

    const handleRating = () => {
        if (ratingObject.rating === 0) {
            toast.error("Please rating course");
        }
        toast.promise(
            userService.ratingCourse(enrollment.course.id, ratingObject),
            {
                loading: "Rating...",
                success: () => {
                    setOpenModal(false);
                    return "Rating successfully";
                },
                error: "Rating failed, trye again",
            }
        );
    };

    return (
        <>
            <ModalNoBody
                title="Rating"
                isOpen={isOpenModal}
                closeModal={handleCloseModal}
            >
                <div className="my-2 center flex-col">
                    <Rating
                        size="large"
                        className="custom-rating"
                        value={ratingObject.rating || 0}
                        name="half-rating"
                        defaultValue={0}
                        precision={1}
                        onChange={(e) =>
                            setRatingObject({
                                ...ratingObject,
                                rating: e.target.value,
                            })
                        }
                    />
                    <InputComponent
                        size="lg"
                        value={ratingObject.comment || ""}
                        classNames="w-full mt-4"
                        placeholder={"Leave a comment"}
                        noLabel
                        onHandleChange={(e) =>
                            setRatingObject({
                                ...ratingObject,
                                comment: e.target.value,
                            })
                        }
                    ></InputComponent>
                    <div className="flex justify-end mt-3 w-full gap-2">
                        <button
                            className="rounded-lg relative bg-orange-600 p-2 text-white float-end font-bold text-sm"
                            type="button"
                            onClick={handleRating}
                        >
                            <Ink></Ink>
                            Send
                        </button>
                        <button
                            className="rounded-lg relative bg-white p-2 border-black border text-black float-end font-bold text-sm"
                            type="button"
                            onClick={handleCloseModal}
                        >
                            <Ink></Ink>
                            Close
                        </button>
                    </div>
                </div>
            </ModalNoBody>
            <header className="bg-black w-full relative h-[55px] flex items-center gap-4 text-white justify-between">
                <div className="flex gap-4 items-center h-full">
                    <Link to="/">
                        <img
                            src={logo}
                            alt="Dream Chasers"
                            className="mx-4 h-full w-[55px]"
                        ></img>
                    </Link>
                    <div className="h-[40%] border-l-1 border-gray-100"></div>
                    <div className="font-normal text-bsae">
                        {enrollment?.course?.title ||
                            "Google Gemini AI with Python API - Quick Start"}
                    </div>
                </div>
                <div className="flex items-center gap-6 mr-10 h-full">
                    <div className="flex items-center gap-2 bg-white rounded-lg px-3 text-center">
                        <div className="text-sm font-normal text-black">
                            Leave A Rating:
                        </div>
                        <Rating
                            className="custom-rating"
                            name="half-rating"
                            value={ratingObject.rating}
                            defaultValue={0}
                            precision={1}
                            onChange={(e) => handleRatingCourse(e)}
                        />
                    </div>
                    <div className="h-[40%] border-l-1 border-gray-100"></div>
                    <div className="center gap-2.5 h-full">
                        <Box
                            sx={{
                                position: "relative",
                                display: "inline-flex ",
                            }}
                        >
                            <CircularProgress
                                color="white"
                                className=""
                                variant="determinate"
                                value={getPercent}
                            />
                            <Box
                                sx={{
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    position: "absolute",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    component="div"
                                    sx={{ color: "white" }}
                                >
                                    {getPercent}%
                                </Typography>
                            </Box>
                        </Box>
                        <PopoverComponent
                            buttonText={"Your progress"}
                            classNames={"top-full right-1/2 px-4 py-2"}
                        >
                            <div className="text-black text-sm font-bold">
                                {enrollment?.totalCompletedLessons} of{" "}
                                {enrollment?.totalLessons} lessons completed
                            </div>
                        </PopoverComponent>
                    </div>
                    <div className="h-[40%] border-l-1 border-gray-100"></div>
                    <div className="center gap-2.5 h-full">
                        <PopoverComponent
                            classNames={"top-full right-0"}
                            hasBorderBtn={true}
                            hasArrow={false}
                            x="0"
                            IconJsx={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                                    />
                                </svg>
                            }
                        >
                            <div className="text-black text-sm flex flex-col py-2 gap-1 w-60">
                                <div className="gap-2 py-1.5 px-3.5 flex  hover:opacity-80 hover:bg-gray-100 transition-all relative cursor-pointer">
                                    <Ink></Ink>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                        />
                                    </svg>
                                    Favorite this course
                                </div>
                                <div className="gap-2 py-1.5 px-3.5 flex hover:opacity-80 hover:bg-gray-100 transition-all relative cursor-pointer">
                                    <Ink></Ink>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                        />
                                    </svg>
                                    Archive this course
                                </div>
                            </div>
                        </PopoverComponent>
                    </div>
                </div>
            </header>
        </>
    );
};

const handleSearchTitle = (sections, title) => {
    let result = [];
    title = title.toLowerCase();
    sections.forEach((s) => {
        let lessonsResult = [];

        s.lessons?.forEach((l) => {
            if (l.title.toLowerCase().includes(title)) lessonsResult.push(l);
        });

        if (s.title.toLowerCase().includes(title) || lessonsResult.length > 0) {
            result.push({ ...s, lessons: lessonsResult });
        }
    });
    return result;
};

const getSumLessons = (sections) => {
    let total = 0;
    sections?.forEach((s) => {
        s.lessons?.map((l) => total++);
    });
    return total;
};

const SearchTab = ({ sections }) => {
    const [searchTitle, setSearchTitle] = useState("");
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [listSectionShow, setListSectionsShow] = useState([]);

    useEffect(() => {}, [sections]);

    const debounceSearch = utils.debounce((sections, title) => {
        const result = handleSearchTitle(sections, title);
        setListSectionsShow(result);
        setLoadingSearch(false);
    }, 600);

    const handleSearch = (e) => {
        const title = e.target.value;
        setSearchTitle(title);
        if (title === "") {
            setListSectionsShow([]);
            return;
        }
        setLoadingSearch(true);
        debounceSearch(sections, title);
    };

    return (
        <>
            <div className="w-full h-full center mt-4">
                <div className="w-1/2">
                    <div
                        className={clsx(
                            "relative flex flex-col items-center px-2 py-2.5 transition-all bg-white border-1 border-gray-300 w-full hover:border-black"
                        )}
                    >
                        <div className="flex w-full">
                            <input
                                type="text"
                                value={searchTitle}
                                onChange={handleSearch}
                                className="flex-grow text-sm pl-2 pr-4 text-gray-700 leading-tight focus:outline-none rounded-l-full"
                                placeholder="Search section, lesson..."
                            />
                            <div className="absolute inset-y-0 right-10 flex items-center mr-1.5">
                                {searchTitle.length > 0 && !loadingSearch && (
                                    <button
                                        onClick={() => {
                                            setSearchTitle("");
                                            setListSectionsShow([]);
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="#a6a7ac"
                                            className="w-5 h-5 hover:opacity-80"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                )}
                                {loadingSearch && searchTitle !== "" && (
                                    <img
                                        src={loadingIcon}
                                        alt="Loading"
                                        className="w-3 h-3 animate-spin"
                                    />
                                )}
                            </div>
                            <div className="flex items-center pl-2">
                                <span className="border-l h-6 border-gray-300" />
                                <button className="px-2">
                                    <img
                                        src={searchIcon}
                                        alt="Search"
                                        className="w-4 h-4"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>
                        {!loadingSearch && listSectionShow?.length > 0 && (
                            <>
                                <div className="mt-12 p-[16px] font-normal">
                                    Result for <strong> "{searchTitle}"</strong>{" "}
                                    {"(" +
                                        listSectionShow.length +
                                        " section - " +
                                        getSumLessons(listSectionShow) +
                                        " lesson)"}
                                </div>
                                {listSectionShow?.length > 0 &&
                                    listSectionShow.map((s, index) => (
                                        <SectionItem
                                            index={index + 1}
                                            key={s.title}
                                            section={s}
                                        ></SectionItem>
                                    ))}
                            </>
                        )}
                        {!loadingSearch &&
                            searchTitle !== "" &&
                            listSectionShow?.length === 0 && (
                                <div className="mt-12 p-[16px] font-normal center flex-col">
                                    <div className="font-bold text-2xl">
                                        {`Sorry, no results for "${searchTitle}".`}
                                    </div>
                                    Your search did not match any captions,
                                    lectures or resources
                                </div>
                            )}
                        {!searchTitle && (
                            <div className="mt-12 p-[16px] font-normal center flex-col">
                                <div className="font-bold text-2xl">
                                    Start a new search
                                </div>
                                To find sections, lectures, resource
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

const OverviewTab = ({ course }) => {
    const date = new Date(course?.updatedAt);

    const options = { year: "numeric", month: "long" };
    const formattedDate = date.toLocaleDateString("en-US", options);

    let totalLesson = 0;
    course?.sections?.forEach((s) => {
        totalLesson += s.lessons?.length;
    });

    return (
        <div className="w-full h-full">
            <div className="mx-6">
                <div className="text-2xl font-medium mb-6">
                    {" "}
                    {course?.title}.
                </div>
                <div className="mb-4 flex gap-4 ">
                    <div>
                        <div className="text-base font-bold center gap-1">
                            {course?.scoreRating.toFixed(1) || 0}
                            <svg
                                focusable="false"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                className="w-6 h-6"
                                fill="#ffd700"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
                            </svg>
                        </div>
                        <div className="text-xs font-light center text-[#6a6f73]">
                            {course?.totalRating} ratings
                        </div>
                    </div>
                    <div>
                        <div className="text-base font-bold center">
                            {course?.totalRegister?.toLocaleString("en-US")}
                        </div>
                        <div className="text-xs font-light text-[#6a6f73 center]">
                            Students
                        </div>
                    </div>
                    <div>
                        <div className="text-base font-bold center">
                            {utils.convertSecondsToRoundTime(
                                course?.totalDuration,
                                true
                            ) || 0}
                        </div>
                        <div className="text-xs font-light text-[#6a6f73] center">
                            Total
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex text-[#2d2f31] gap-2 text-sm font-normal items-center mb-[16px]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.0}
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"
                            />
                        </svg>
                        Sections: {" " + course?.sections?.length}{" "}
                        <span className="mx-3">-</span>
                        Lectures: {totalLesson}
                    </div>
                    <div className="flex text-[#2d2f31] gap-2 text-sm font-normal items-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.0}
                            stroke="currentColor"
                            className="size-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                            />
                        </svg>
                        Last updated {formattedDate}
                    </div>
                </div>
            </div>
            <div className="w-full border-t-1 border-gray-200 mt-4"></div>
            <div className="grid grid-cols-12 font-normal p-6 gap-y-6">
                <div className="lg:col-span-3">Description</div>
                <div className="lg:col-span-9">
                    <div
                        className="html-content"
                        dangerouslySetInnerHTML={{
                            __html: course?.description,
                        }}
                    ></div>
                </div>
                <div className="col-span-12 border-t-1 border-gray-200 mt-4"></div>

                <div className="lg:col-span-3">Instructor</div>
                <div className="lg:col-span-9">
                    <div className="flex gap-6">
                        <img
                            src={course?.author?.avatarUrl}
                            alt="avatar"
                            className="rounded-full w-16 h-16"
                        />
                        <div className="flex justify-center flex-col">
                            <div className="font-bold text-base">
                                {course?.author?.firstName +
                                    " " +
                                    course?.author?.lastName}
                            </div>
                            <div className="font-normal text-base text-gray-400">
                                {course?.author?.email}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 text-[16px]">
                        I have over 15 years experience in storytelling,
                        primarily in video. I have directed and produced two
                        feature films that have screened at international film
                        festivals and have been distributed internationally as
                        well.
                    </div>
                </div>
            </div>
        </div>
    );
};

const NoteTab = ({ videoRef, course, duration = "0:00", lessonId }) => {
    const [refresh, setRefresh] = useState(false);
    const [isOpenEditNote, setOpenEditNote] = useState(false);
    const [listNote, setListNote] = useState([
        { id: 1, time: 0, description: "This is a note" },
    ]);
    const [noteUpdate, setNoteUpdate] = useState({});
    const [pagination, setPagination] = useState({
        page: 0,
        size: 99,
    });
    const [modalContent, setModalContent] = useState({
        title: "DELETE",
        description: "Are you sure want to delete?",
        handleRemove: () => {},
        isOpen: false,
        handleCloseModal: () => {
            setModalContent({ ...modalContent, isOpen: false });
        },
    });
    const [note, setNote] = useState({
        time: duration,
        content: "",
    });
    const [openTextEditor, setOpenTextEditor] = useState(false);
    const [filterNote, setFilterNote] = useState({
        lecture: 0, // 0: all lecture, 1: lecture1
        order: "asc", // DESC
    });

    useEffect(() => {
        if (!isOpenEditNote) setNote({ ...note, time: Math.round(duration) });
    }, [duration, isOpenEditNote]);

    useEffect(() => {
        const getNote = async () => {
            try {
                const res =
                    await userService.getCourseByCourseAndLectureAndSortBy(
                        course?.id,
                        filterNote.lecture,
                        filterNote.order,
                        pagination.page,
                        pagination.size
                    );
                setListNote(res.content);
            } catch (error) {
                console.log(error);
            }
        };

        getNote();
    }, [pagination, filterNote, course?.id, refresh]);

    const handleSaveNote = () => {
        toast.promise(userService.saveNote(course?.id, lessonId, note), {
            loading: "Saving...",
            success: (res) => {
                setNote({
                    time: utils.convertSecondsToHHMMSS(duration),
                    content: "",
                });
                setRefresh(!refresh);
                return "Save note successfully";
            },
            error: (error) => {
                console.log(error);
                return error.message;
            },
        });
    };

    const handleOpenCreateNote = (id) => {
        videoRef.current?.pause();
        setOpenTextEditor(true);
        const getNote = async (time, lessonId) => {
            try {
                const res = await userService.getNoteByTime(id, note.time);
                setNote({
                    time: res.time,
                    content: res.content,
                });
            } catch (error) {
                console.log(error);
            }
        };
        getNote();
    };

    const handleUpdateNote = () => {
        toast.promise(userService.updateNote(noteUpdate), {
            loading: "Updating...",
            success: (res) => {
                var updateList = listNote?.map((note) => {
                    if (note.id === res.id) {
                        return res;
                    }
                    return note;
                });
                setListNote(updateList);
                setNoteUpdate({});
                setOpenEditNote(false);
                return "Update successfully";
            },
            error: (error) => {
                console.log(error);
                return "Error while update";
            },
        });
    };

    const handleDeleteNote = (noteId) => {
        toast.promise(userService.deleteNoteById(noteId), {
            loading: "loading...",
            success: () => {
                let newListNote = listNote.filter((note) => note.id !== noteId);
                setListNote(newListNote);
                setModalContent({ ...modalContent, isOpen: false });
                return "Delete successfully";
            },
            error: (error) => {
                console.log(error);
                return "Error, try again!";
            },
        });
    };

    return (
        <div className="w-full h-full center mt-4">
            <div className="w-1/2">
                {!openTextEditor ? (
                    <div
                        className={clsx(
                            "relative flex flex-col items-center px-2 py-2.5 transition-all bg-white border-1 border-gray-300 w-full hover:border-black"
                        )}
                    >
                        <div
                            onClick={() => {
                                handleOpenCreateNote(lessonId);
                            }}
                            className="flex w-full relative cursor-pointer"
                        >
                            <div
                                type="text"
                                className="flex-grow text-sm pl-2 pr-4 text-gray-700 leading-tight focus:outline-none rounded-l-full"
                            />
                            <div className="absolute font-light left-2 text-base text-gray-500">
                                Create a new note at{" "}
                                {utils.convertSecondsToHHMMSS(duration)}
                            </div>
                            <div className="absolute inset-y-0 right-10 flex items-center mr-1.5"></div>
                            <div className="flex items-center pl-2">
                                <span className="border-l h-6 border-gray-300" />
                                <button className="px-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        id="plus"
                                    >
                                        <path
                                            fill="#200E32"
                                            d="M14.6602,0.0001 C18.0602,0.0001 20.0002,1.9201 20.0002,5.3301 L20.0002,5.3301 L20.0002,14.6701 C20.0002,18.0601 18.0702,20.0001 14.6702,20.0001 L14.6702,20.0001 L5.3302,20.0001 C1.9202,20.0001 0.0002,18.0601 0.0002,14.6701 L0.0002,14.6701 L0.0002,5.3301 C0.0002,1.9201 1.9202,0.0001 5.3302,0.0001 L5.3302,0.0001 Z M9.9902,5.5101 C9.5302,5.5101 9.1602,5.8801 9.1602,6.3401 L9.1602,6.3401 L9.1602,9.1601 L6.3302,9.1601 C6.1102,9.1601 5.9002,9.2501 5.7402,9.4001 C5.5902,9.5601 5.5002,9.7691 5.5002,9.9901 C5.5002,10.4501 5.8702,10.8201 6.3302,10.8301 L6.3302,10.8301 L9.1602,10.8301 L9.1602,13.6601 C9.1602,14.1201 9.5302,14.4901 9.9902,14.4901 C10.4502,14.4901 10.8202,14.1201 10.8202,13.6601 L10.8202,13.6601 L10.8202,10.8301 L13.6602,10.8301 C14.1202,10.8201 14.4902,10.4501 14.4902,9.9901 C14.4902,9.5301 14.1202,9.1601 13.6602,9.1601 L13.6602,9.1601 L10.8202,9.1601 L10.8202,6.3401 C10.8202,5.8801 10.4502,5.5101 9.9902,5.5101 Z"
                                            transform="translate(2 2)"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full">
                        <div className="flex gap-2">
                            <div className="bg-black text-white font-semibold p-2 rounded-md h-6 text-sm center">
                                {utils.convertSecondsToHHMMSS(note?.time)}
                            </div>
                            <div className="font-light">
                                <ReactQuill
                                    value={note.content || ""}
                                    onChange={(content) => {
                                        setNote((prev) => ({
                                            ...prev,
                                            content: content,
                                        }));
                                    }}
                                    modules={toolbar}
                                    formats={formats}
                                ></ReactQuill>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 items-center w-full mt-4 mb-9">
                            <button
                                type="button"
                                onClick={() => setOpenTextEditor(false)}
                                className="border border-black font-bold text-sm cursor-pointer transition-all hover:opacity-85 relative text-black p-2 rounded-md"
                            >
                                <Ink></Ink>
                                Cancel
                            </button>
                            <button
                                onClick={() => handleSaveNote(lessonId)}
                                type="button"
                                className="font-bold text-sm cursor-pointer transition-all hover:opacity-85 relative text-white bg-black p-2 rounded-md"
                            >
                                <Ink></Ink>
                                Save note
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex gap-2 mt-2 mb-8">
                    <div className="h-11 flex-1">
                        <SelectComponent
                            value={filterNote?.lecture}
                            data={[
                                { label: "All lectures", value: "0" },
                                { label: "Current lecture", value: lessonId },
                            ]}
                            placeholder={"All lectures"}
                            borderRadius={"rounded-none"}
                            handleChange={(e) => {
                                setFilterNote({ ...filterNote, lecture: e });
                            }}
                        ></SelectComponent>
                    </div>
                    <div className="h-11 flex-1">
                        <SelectComponent
                            value={filterNote?.order}
                            placeholder={"Sort by most recent"}
                            data={[
                                { label: "Sort by most recent", value: "desc" },
                                { label: "Sort by oldest", value: "asc" },
                            ]}
                            borderRadius={"rounded-none"}
                            handleChange={(e) => {
                                setFilterNote({ ...filterNote, order: e });
                            }}
                        ></SelectComponent>
                    </div>
                </div>
                <div>
                    {listNote?.map((note) => (
                        <div className="flex gap-3.5 w-full mt-5" key={note.id}>
                            <div className="bg-black text-white font-semibold px-2 py-1 text-sm rounded-md h-6 center">
                                {utils.convertSecondsToHHMMSS(note.time)}
                            </div>

                            <div className="w-full">
                                <div className="flex gap-3">
                                    <div className="flex-1 flex flex-col justify-center">
                                        <div className="">
                                            {note.lesson?.title}
                                        </div>{" "}
                                        <div className="font-light text-sm text-gray-600">
                                            {utils.getTimeElapsed(
                                                note?.createdAt
                                            )}{" "}
                                            <span className="mx-2">-</span>
                                            {utils.formatDateTime(
                                                note?.createdAt
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div
                                            onClick={() => {
                                                setNoteUpdate(note);
                                                setOpenEditNote(true);
                                            }}
                                            className="cursor-pointer relative hover:opacity-80 transition-all"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 512 512"
                                                id="pencil"
                                            >
                                                <path
                                                    fill="#010101"
                                                    d="M64 368v80h80l235.727-235.729-79.999-79.998L64 368zm377.602-217.602c8.531-8.531 8.531-21.334 0-29.865l-50.135-50.135c-8.531-8.531-21.334-8.531-29.865 0l-39.468 39.469 79.999 79.998 39.469-39.467z"
                                                ></path>
                                            </svg>
                                        </div>
                                        <div
                                            onClick={() =>
                                                setModalContent({
                                                    ...modalContent,
                                                    title: "DELETE",
                                                    isOpen: true,
                                                    description:
                                                        "Are you sure want to delete",
                                                    handleRemove: () =>
                                                        handleDeleteNote(
                                                            note.id
                                                        ),
                                                })
                                            }
                                            className="cursor-pointer relative hover:opacity-80 transition-all"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                id="trash"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 512 512"
                                            >
                                                <path d="M413.7 133.4c-2.4-9-4-14-4-14-2.6-9.3-9.2-9.3-19-10.9l-53.1-6.7c-6.6-1.1-6.6-1.1-9.2-6.8-8.7-19.6-11.4-31-20.9-31h-103c-9.5 0-12.1 11.4-20.8 31.1-2.6 5.6-2.6 5.6-9.2 6.8l-53.2 6.7c-9.7 1.6-16.7 2.5-19.3 11.8 0 0-1.2 4.1-3.7 13-3.2 11.9-4.5 10.6 6.5 10.6h302.4c11 .1 9.8 1.3 6.5-10.6zM379.4 176H132.6c-16.6 0-17.4 2.2-16.4 14.7l18.7 242.6c1.6 12.3 2.8 14.8 17.5 14.8h207.2c14.7 0 15.9-2.5 17.5-14.8l18.7-242.6c1-12.6.2-14.7-16.4-14.7z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {isOpenEditNote &&
                                    noteUpdate?.id === note.id ? (
                                        <div className="w-full mt-6">
                                            <div className="flex gap-2">
                                                <div className="font-light">
                                                    <ReactQuill
                                                        value={
                                                            noteUpdate?.content ||
                                                            ""
                                                        }
                                                        onChange={(content) => {
                                                            setNoteUpdate(
                                                                (prev) => ({
                                                                    ...prev,
                                                                    content:
                                                                        content,
                                                                })
                                                            );
                                                        }}
                                                        modules={toolbar}
                                                        formats={formats}
                                                    ></ReactQuill>
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 items-center w-full mt-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setOpenEditNote(false)
                                                    }
                                                    className="border border-black font-bold text-sm cursor-pointer transition-all hover:opacity-85 relative text-black p-2 rounded-md"
                                                >
                                                    <Ink></Ink>
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateNote(
                                                            note?.id
                                                        )
                                                    }
                                                    type="button"
                                                    className="font-bold text-sm cursor-pointer transition-all hover:opacity-85 relative text-white bg-black p-2 rounded-md"
                                                >
                                                    <Ink></Ink>
                                                    Save note
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="bg-gray-100 text-gray-700 w-full mt-2 font-light p-6"
                                            dangerouslySetInnerHTML={{
                                                __html: note?.content,
                                            }}
                                        ></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Modal
                isOpen={modalContent.isOpen}
                closeModal={modalContent.handleCloseModal}
                handleRemove={modalContent.handleRemove}
                title={modalContent.title}
                description={modalContent.description}
            ></Modal>
        </div>
    );
};

const listStarts = [
    { label: "All", value: "0" },
    { label: "Five stars", value: "5" },
    { label: "Four stars", value: "4" },
    { label: "Three stars", value: "3" },
    { label: "Two stars", value: "2" },
    { label: "One stars", value: "1" },
];

const ReviewTab = ({ course }) => {
    const [filter, setFilter] = useState({
        comment: "",
        star: 0,
    });
    const [listRating, setListRating] = useState([
        { comment: "", rating: 0, user: { firstName: "", lastName: "" } },
    ]);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 8,
        totalPage: 1,
    });
    const [statisticRating, setStatisticRating] = useState([
        { rating: 5, percent: 0 },
        { rating: 4, percent: 0 },
        { rating: 3, percent: 0 },
        { rating: 2, percent: 0 },
        { rating: 1, percent: 0 },
    ]);
    const firstRender = useRef(true);

    const getPercent = (count, total) => {
        return Math.round((count / total) * 100);
    };

    const handleSearch = (e) => {
        let value = e.target.value;
        setFilter({ ...filter, comment: value });
    };

    const handleStatisticData = (statistic, totalRating) => {
        return [
            {
                rating: 5,
                percent: getPercent(
                    statistic[0]?.rating_count || 0,
                    totalRating
                ),
            },
            {
                rating: 4,
                percent: getPercent(
                    statistic[1]?.rating_count || 0,
                    totalRating
                ),
            },
            {
                rating: 3,
                percent: getPercent(
                    statistic[2]?.rating_count || 0,
                    totalRating
                ),
            },
            {
                rating: 2,
                percent: getPercent(
                    statistic[3]?.rating_count || 0,
                    totalRating
                ),
            },
            {
                rating: 1,
                percent: getPercent(
                    statistic[4]?.rating_count || 0,
                    totalRating
                ),
            },
        ];
    };

    const getRatingByStarAndComment = async () => {
        try {
            const res = await publicService.filterRatingByStarAndComment(
                course?.id,
                filter.star,
                filter.comment,
                pagination.page,
                pagination.size
            );
            setPagination({ ...pagination, totalPage: res.totalPages });
            setListRating(res.content);
        } catch (error) {
            console.log(error);
        }
    };
    const debouncedSearch = utils.debounce(getRatingByStarAndComment, 600);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await publicService.getStatisticRatingOfCourse(
                    course?.id
                );
                setListRating(res.rating.content);
                let totalRating = res.rating.totalElements;
                let dataRatings = handleStatisticData(
                    res.statistic,
                    totalRating
                );
                setStatisticRating(dataRatings);
            } catch (error) {
                console.log(error);
            }
        };

        if (firstRender.current) {
            firstRender.current = false;
            fetchApi();
        } else {
            debouncedSearch();
        }
    }, [
        course?.id,
        filter.star,
        filter.comment,
        pagination.page,
        pagination.size,
    ]);

    const handleFilterStar = (star) => {
        setFilter({ ...filter, star: star });
    };

    const handleChangePagination = (value) => {
        setPagination((prev) => {
            return {
                ...prev,
                page: value - 1,
            };
        });
    };

    return (
        <div className="flex">
            <div className="mx-auto pt-8 px-6 flex justify-center flex-col">
                <div className="flex flex-col">
                    <span className="text-3xl font-bold mb-6">
                        Student feedback
                    </span>
                    <div className="flex gap-4 justify-center">
                        <div className="text-[#b4690e] center flex-col">
                            <div className="text-7xl font-bold center">
                                {course?.scoreRating?.toFixed(1) || 0}
                            </div>
                            <div>
                                <Rating
                                    style={{ color: "#b4690e" }}
                                    name="customized-color"
                                    precision={0.5}
                                    defaultValue={course?.scoreRating}
                                    readOnly
                                ></Rating>
                            </div>
                            <div className="text-sm font-bold">
                                Tutorial rating
                            </div>
                        </div>
                        <div className="gap-2 flex flex-col">
                            {statisticRating?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-2 items-center cursor-pointer hover:opacity-80 transition-all"
                                    onClick={() =>
                                        handleFilterStar(item.rating)
                                    }
                                >
                                    <div className="flex flex-col w-[500px] gap-3 center">
                                        <div className="bg-gray-200 z-[1] ralative w-full h-2">
                                            <div
                                                className={`h-2 top-0 left-0 bg-gray-600 z-[2]`}
                                                style={{
                                                    width: `${item.percent}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="center">
                                        <Rating
                                            style={{ color: "#b4690e" }}
                                            name="customized-color"
                                            defaultValue={item.rating}
                                            readOnly
                                        ></Rating>
                                    </div>
                                    <div className="underline transition-all text-blue-700 font-light">
                                        {item.percent || 0}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="max-w-[800px] mb-6">
                    <h3 className="font-bold mt-8 mb-4">Reviews</h3>
                    <div className="flex gap-2">
                        <div
                            className={clsx(
                                "relative flex items-center px-2 py-2.5 transition-all bg-white border-1 border-gray-300 w-full hover:border-black"
                            )}
                        >
                            <input
                                type="text"
                                value={filter.text}
                                onChange={handleSearch}
                                className="flex-grow text-sm pl-2 pr-4 text-gray-700 leading-tight focus:outline-none rounded-l-full"
                                placeholder="Search reviews"
                            />

                            <div className="flex items-center pl-2">
                                <span className="border-l h-6 border-gray-300" />
                                <button className="px-2">
                                    <img
                                        src={searchIcon}
                                        alt="Search"
                                        className="w-4 h-4"
                                    />
                                </button>
                            </div>
                        </div>
                        <div>
                            <SelectComponent
                                value={filter?.star}
                                placeholder="Filter a start"
                                data={listStarts}
                                borderRadius={"rounded-none"}
                                handleChange={(e) => {
                                    setFilter({ ...filter, star: e });
                                }}
                            ></SelectComponent>
                        </div>
                    </div>
                </div>
                <div className="list-review max-w-[800px]">
                    {listRating.length > 0 ? (
                        listRating?.map((r, index) => (
                            <>
                                <div
                                    className="review-item flex gap-4 pt-[18px] pb-7"
                                    key={r.user.id}
                                >
                                    <img
                                        src={
                                            r?.user?.avatarUrl ||
                                            "https://img-c.udemycdn.com/user/50x50/282392139_e4ab.jpg"
                                        }
                                        alt="avatar"
                                        className="rounded-full w-12 h-12"
                                    />
                                    <div className="flex flex-col gap-3">
                                        <div className="font-bold text-base mb">
                                            {r.user.firstName +
                                                " " +
                                                r.user.lastName}
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <Rating
                                                style={{ color: "#b4690e" }}
                                                size="small"
                                                readOnly
                                                defaultValue={5}
                                                value={r?.rating}
                                            ></Rating>
                                            <div className="text-xs text-gray-400 font-light">
                                                {utils.getTimeElapsed(
                                                    r.createdAt
                                                )}
                                            </div>
                                        </div>
                                        <div className="font-light text-sm">
                                            {r?.comment}
                                        </div>
                                    </div>
                                </div>
                                {index >= 0 &&
                                    index < listRating.length - 1 && (
                                        <div className="w-full border-t-1 border-gray-300"></div>
                                    )}
                            </>
                        ))
                    ) : (
                        <div className="font-normal">
                            There are no written comments for the rating you've
                            selected. Please select another rating or clear your
                            selection to view all written comments for this
                            course.
                        </div>
                    )}
                </div>
                <div>
                    {pagination.totalPage > 1 && (
                        <PaginationItem
                            count={pagination.totalPage}
                            handleChange={handleChangePagination}
                        ></PaginationItem>
                    )}
                </div>
            </div>
        </div>
    );
};

function LearningCourse() {
    const { id } = useParams();
    const [selectedLesson, setSelectedLesson] = useState({
        progress: {},
        video: "",
    });
    const [enrollment, setEnrollment] = useState({});
    const [course, setCourse] = useState({});
    const videoRef = useRef(null);
    const [duration, setDuration] = useState(0);
    const [listProgress, setListProgress] = useState([]);

    const handleSelectedLesson = (lesson) => {
        setSelectedLesson(lesson);
    };

    const reInitState = (enrollment, course, listProgress) => {
        setEnrollment(enrollment);
        setCourse(course);
        setListProgress(listProgress);
    };

    const handleUpdateCompleted = async () => {
        try {
            const res = await userService.completedLesson(
                course.id,
                selectedLesson.progress.lessonId
            );
            reInitState(res, res.course, res.progresses);
            toast.success("Congratulations on completing the lesson");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await userService.getEnrollment(id);
                setSelectedLesson({
                    progress: res.progresses[0],
                    video: res.course.sections[0]?.lessons[0]?.video,
                });
                reInitState(res, res.course, res.progresses);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [id]);

    const handleTimeUpdate = (e) => {
        const playedSeconds = e.target.currentTime;
        if (
            playedSeconds > 0 &&
            playedSeconds >= selectedLesson.progress?.duration * 0.7 &&
            !selectedLesson.progress?.completed
        ) {
            setSelectedLesson((prev) => ({
                ...prev,
                progress: { ...prev.progress, completed: true },
            }));
            handleUpdateCompleted();
        }
    };

    return (
        <>
            <Header
                myRating={enrollment.myRating}
                enrollment={enrollment}
            ></Header>
            <div className="w-full relative flex">
                <div className="app-learning-column h-[200vh] overflow-y-auto">
                    <div>
                        <video
                            ref={videoRef}
                            src={selectedLesson?.video}
                            controls
                            width="100%"
                            height="100%"
                            onTimeUpdate={handleTimeUpdate}
                            style={{
                                overflow: "hidden",
                                height: "100%",
                            }}
                            controlsList="nodownload"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                    <div className="px-4">
                        <div className="flex items-center mt-2 flex-col">
                            <Tabs aria-label="Dynamic tabs" items={tabs}>
                                <Tab
                                    className="font-semibold text-base w-full h-full"
                                    title={tabs[0].label}
                                >
                                    <SearchTab
                                        sections={course?.sections}
                                    ></SearchTab>
                                </Tab>
                                <Tab
                                    className="font-semibold text-base w-full h-full"
                                    title={tabs[1].label}
                                >
                                    <OverviewTab course={course}></OverviewTab>
                                </Tab>
                                <Tab
                                    className="font-semibold text-base w-full h-full"
                                    title={tabs[2].label}
                                >
                                    <DiscussionTab
                                        courseId={course?.id}
                                        lessonId={
                                            selectedLesson?.progress?.lessonId
                                        }
                                    ></DiscussionTab>
                                </Tab>
                                <Tab
                                    className="font-semibold text-base w-full h-full"
                                    title={tabs[3].label}
                                >
                                    <NoteTab
                                        lessonId={
                                            selectedLesson?.progress?.lessonId
                                        }
                                        videoRef={videoRef}
                                        duration={duration}
                                        course={course}
                                        selectedLesson={selectedLesson}
                                    ></NoteTab>
                                </Tab>
                                <Tab
                                    className="font-semibold text-base w-full h-full"
                                    title={tabs[4].label}
                                >
                                    <ReviewTab course={course}></ReviewTab>
                                </Tab>
                            </Tabs>
                        </div>
                    </div>
                </div>
                <div className="sticky app-section-column h-[100vh] overflow-y-auto right-0 top-[0] border-l-1 border-gray-300">
                    <div className="px-4 py-3 font-bold text-xl ">
                        Curriculum
                    </div>
                    <div>
                        {course?.sections?.map((s, index) => {
                            return (
                                <SectionItem
                                    index={s.title}
                                    listProgress={listProgress}
                                    selectedLesson={selectedLesson}
                                    onSelectFunc={handleSelectedLesson}
                                    key={s.title}
                                    section={s}
                                ></SectionItem>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default LearningCourse;

const tabs = [
    {
        id: "1",
        label: "Search",
    },
    {
        id: "2",
        label: "Overview",
    },
    {
        id: "3",
        label: "Communication",
    },
    {
        id: "4",
        label: "Notes",
    },
    {
        id: "5",
        label: "Reviews",
    },
];

const toolbar = {
    toolbar: {
        container: [
            [{ header: "1" }, { header: "2" }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
            ["code-block"],
        ],
    },
    clipboard: {
        matchVisual: false,
    },
};

const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "link",
    "imageBlot",
    "code-block",
];
