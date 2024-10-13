import React, { useState, useEffect, useRef } from "react";
import searchIcon from "../../assets/images/search.png";
import loadingIcon from "../../assets/images/loading.png";
import * as dataApi from "../../api/apiService/dataService";
import clsx from "clsx";
import styles from "./Search.module.scss";
import { Link } from "react-router-dom";
let timerId = null;

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const searchBarRef = useRef(null);
    const [loading, setloading] = useState(false);
    const inputRef = useRef();

    const fetchApi = async (title) => {
        try {
            const result = await dataApi.searchCourseByNameAndPostByTitle(
                title
            );
            setloading(false);
            setShowResult(true);
            setSearchResult(result.content);
        } catch (error) {
            console.log(error);
        }
    };
    const debounce = (func, delay = 800) => {
        return (title) => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func(title);
            }, delay);
        };
    };

    const handleSearch = (event) => {
        const title = event.target.value;

        setSearchTerm(title);
        setloading(true);
        if (title.trim() === "") {
            setSearchResult((prev) => []);
            setShowResult((prev) => false);
            clearTimeout(timerId);
            return;
        }
        setShowResult(true);
        debounce(fetchApi, 300)(title);
    };

    const handleClickOutside = (event) => {
        if (
            searchBarRef.current &&
            !searchBarRef.current.contains(event.target)
        ) {
            setShowResult(false);
        }
    };
    const clearSearch = () => {
        setSearchTerm("");
        inputRef.current.focus();
        setSearchResult([]);
        setShowResult(false);
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleShowResult = () => {
        if (searchResult?.length > 0 && !showResult) {
            setShowResult(true);
        }
    };

    return (
        <div
            className={clsx(
                styles.searchWrap,
                "relative flex flex-col items-center p-2 bg-white border-1 border-gray-300 rounded-full w-130 hover:border-black"
            )}
            ref={searchBarRef}
        >
            <div className="flex w-full">
                <input
                    ref={inputRef}
                    onClick={handleShowResult}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="flex-grow text-xs  pl-2 pr-4 text-gray-700 leading-tight focus:outline-none rounded-l-full"
                    placeholder="Search course, post..."
                />
                <div className="absolute inset-y-0 right-10 flex items-center mr-1.5">
                    {searchTerm.length > 0 && !loading && (
                        <button onClick={clearSearch}>
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
                    {loading && searchTerm !== "" && (
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
            {showResult && (
                <div className="absolute top-full bg-white border border-gray-300 rounded-md shadow-lg w-full z-20 mt-3">
                    {searchResult?.posts?.length > 0 ||
                    searchResult?.courses?.length > 0 ? (
                        <div className="px-6 py-3">
                            <h4 className="font-semibold text-sm uppercase  ">
                                Course
                            </h4>
                            <hr className="cssHr" />

                            {searchResult?.courses?.map((course, index) => (
                                <Link
                                    to={"/course/" + course.id}
                                    key={index}
                                    className="flex font-semibold text-sm  py-2.5 truncate hover:bg-gray-100 cursor-pointer row"
                                >
                                    <div className="w-9 h-9 rounded-full col-lg-3">
                                        <img
                                            loading="lazy"
                                            src={
                                                course.thumbnail
                                                    ? course.thumbnail
                                                    : ""
                                            }
                                            alt="thumbnail"
                                            className="rounded-full size-full object-cover"
                                        />
                                    </div>
                                    <div className="col-lg-9 ">
                                        <span className="line-clamp-1 whitespace-pre-wrap">
                                            {course.title}
                                        </span>
                                        <div className="font-normal text-xs">
                                            Tags:
                                            {course?.categories?.map(
                                                (cate, ind) => (
                                                    <span
                                                        className="ml-1"
                                                        key={ind}
                                                    >
                                                        {cate.name}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {searchResult?.courses?.length === 0 && (
                                <span className="flex justify-center mt-2 text-sm font-semibold text-gray-500">
                                    No course found
                                </span>
                            )}
                            <h4 className="mt-2 font-semibold text-sm uppercase ">
                                Post
                            </h4>
                            <hr className="cssHr" />

                            {searchResult?.posts?.map((element, index) => (
                                <Link
                                    to={
                                        "/posts/" +
                                        encodeURIComponent(element.title)
                                    }
                                    key={index}
                                    className="flex font-semibold text-sm  py-2.5 truncate hover:bg-gray-100 cursor-pointer row"
                                >
                                    <div className="w-9 h-9 col-lg-3">
                                        <img
                                            loading="lazy"
                                            src={
                                                element.thumbnail
                                                    ? element.thumbnail
                                                    : ""
                                            }
                                            alt="thumbnail"
                                            className="rounded-full  size-full object-cover"
                                        />
                                    </div>
                                    <div className="text-wrap flex items-center col-lg-9">
                                        <span className="whitespace-pre-wrap">
                                            {element.title}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                            {searchResult?.posts?.length === 0 && (
                                <span className="flex justify-center mt-2 text-sm font-semibold text-gray-500">
                                    No post found
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="p-4 flex items-center text-xs flex-col ">
                            <span className="text-base font-bold mb-2">
                                Not Found
                            </span>
                            <span className="mb-1">
                                No results found for "
                                <strong>{searchTerm}</strong>".
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
