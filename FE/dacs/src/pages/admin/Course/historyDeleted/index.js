import styles from "../list/List.module.scss";
import clsx from "clsx";
import restoreIcon from "../../../../assets/images/restore.svg";
import noDataIcon from "../../../../assets/images/ic_noData.svg";
import { Fragment, useEffect, useState } from "react";
import * as dataApi from "../../../../api/apiService/dataService";
import Select from "react-select";
import { toast } from "sonner";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

const selectes = [5, 10, 25];

function HistoryDeleted() {
    const [courses, setCourses] = useState([]);
    const [options, setOptions] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);

    const handleSelectChange = (e) => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getCoursesDeletedByCategory(
                    e.id,
                    page,
                    selected
                );
                setCourses(result.content.content);
                setTotalData(result.content.totalElements);
            } catch (error) {
                console.log(error);
            }
        };

        const debounceApi = debounce(fetchApi);
        debounceApi();
    };

    const handleRestoreCourse = (id) => {
        toast.promise(dataApi.restoreCourseById(id), {
            loading: "loading...",
            success: (data) => {
                console.log(data);
                setCourses(data.content.content);
                return data.mess;
            },
            error: (error) => {
                console.log(error);
                return error.mess;
            },
        });
    };

    const handleSearchInputChange = (e) => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getCourseByName(
                    e.target.value,
                    page,
                    selected,
                    true
                );
                setCourses(result.content.content);
                setTotalData(result.content.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        const debounceApi = debounce(fetchApi, 300);
        debounceApi();
    };

    let timerId;

    const debounce = (func, delay = 600) => {
        return () => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func();
            }, delay);
        };
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCourseDeleted(
                    page,
                    selected
                );
                let categories = [];
                categories = await dataApi.getAllCategories(0, 99999);
                categories.content.content.push({ id: "-1", name: "All" });
                setCourses(result.content.content);
                setTotalData(result.content.totalElements);
                setOptions(categories.content.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, []);

    const handlePageData = async (action) => {
        const currentTotalData = page * selected + selected;
        if (action === "next" && currentTotalData < totalData) {
            console.log("a");
            setPage((prev) => prev + 1);
        }
        if (action === "previous" && page > 0) {
            setPage((prev) => prev - 1);
        }
    };

    const handleSelectPageSizeChange = (size) => {
        setSelected(size);
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCourse(page, size);
                setCourses(result.content.content);
                setTotalData(result.content.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };
    return (
        <div className="flex justify-center w-full ">
            <div className="container mt-4 mx-14">
                <div className="wrapMainDash">
                    <div className={clsx(styles.topMain)}>
                        <div className={clsx(styles.itemTopMain)}>
                            <h4 className="uppercase">History Deleted</h4>
                        </div>
                    </div>

                    <div className="formGroup flex flex-col gap-3">
                        <div
                            className={clsx(
                                styles.contentMain,
                                "flex justify-between"
                            )}
                        >
                            <div className={clsx(styles.contentItem)}>
                                <div
                                    // className={clsx(styles.cbb)
                                    className={clsx(styles.formSelect, "w-52")}
                                >
                                    <label htmlFor="">Category</label>
                                    <Select
                                        onChange={handleSelectChange}
                                        getOptionLabel={(x) => x.name}
                                        getOptionValue={(x) => x.id}
                                        options={options}
                                        placeholder="All"
                                        styles={{
                                            control: (baseStyles, state) => ({
                                                ...baseStyles,
                                                borderColor: state.isFocused
                                                    ? "black"
                                                    : "#e9ecee",
                                            }),
                                        }}
                                    />
                                </div>
                            </div>
                            <div className={clsx(styles.contentItem, "flex-1")}>
                                <div
                                    id="seachWrap"
                                    className={clsx(styles.search)}
                                >
                                    <input
                                        onChange={handleSearchInputChange}
                                        id="searchInput"
                                        type="search"
                                        placeholder="Search.."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={clsx(styles.mid)}>
                            <div
                                className={clsx(
                                    styles.titleMid,
                                    "row rounded-lg"
                                )}
                            >
                                <div className="col-lg-1">Id</div>
                                <div className="col-lg-5">Course</div>
                                <div className="col-lg-2">Create at</div>
                                <div className="col-lg-2">Price</div>
                                <div className="col-lg-2">Action</div>
                            </div>
                            <div className={clsx(styles.containerData)}>
                                {courses &&
                                    courses.map((course, index) => {
                                        const dateTime = new Date(course.date);

                                        const date =
                                            dateTime.toLocaleDateString();
                                        const time =
                                            dateTime.toLocaleTimeString();

                                        return (
                                            <div
                                                key={index}
                                                className={clsx(
                                                    styles.item,
                                                    "row rounded-lg"
                                                )}
                                            >
                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-1"
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.name
                                                        )}
                                                    >
                                                        {course.id}
                                                    </div>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-5 flex "
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.cssImg
                                                        )}
                                                    >
                                                        <img
                                                            src={
                                                                course.thumbnail
                                                            }
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <div
                                                            className={clsx(
                                                                styles.name
                                                            )}
                                                        >
                                                            {course.title}
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                styles.categories
                                                            )}
                                                        >
                                                            {course.category &&
                                                                course.category.join(
                                                                    ", "
                                                                )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-2"
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.name
                                                        )}
                                                    >
                                                        {date}
                                                        <br />
                                                        {time}
                                                    </div>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-2"
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.name
                                                        )}
                                                    >
                                                        {course.price === 0
                                                            ? "Free"
                                                            : `${course.price} VND`}
                                                    </div>
                                                </div>

                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-2"
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.name,
                                                            "flex gap-4"
                                                        )}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRestoreCourse(
                                                                    course.id
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    restoreIcon
                                                                }
                                                                alt=""
                                                            />
                                                        </button>
                                                        {/* <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        course.id
                                                                    )
                                                                }
                                                            >
                                                                <img
                                                                    src={
                                                                        deleteIcon
                                                                    }
                                                                    alt=""
                                                                    className="cursor-pointer"
                                                                />
                                                            </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}

                                {!courses.length && (
                                    <div
                                        className={clsx(
                                            styles.noData,
                                            "flex flex-col justify-center text-center"
                                        )}
                                    >
                                        <img
                                            src={noDataIcon}
                                            alt=""
                                            className={clsx(
                                                styles.noDataImg,
                                                "m-auto w-32"
                                            )}
                                        />
                                        <span>No Data</span>
                                    </div>
                                )}
                            </div>
                            <div className={clsx(styles.footer)}>
                                <div className={styles.footerItem}>
                                    Rows per page:
                                    <div className="b-shadow-light rounded-lg ml-2 w-24">
                                        <Listbox
                                            value={selected}
                                            onChange={
                                                handleSelectPageSizeChange
                                            }
                                        >
                                            <div className="relative mt-1">
                                                <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                    <span className="block truncate">
                                                        {selected}
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                        <ChevronUpDownIcon
                                                            className="h-5 w-5 text-gray-400"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                </Listbox.Button>
                                                <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                >
                                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                        {selectes.map(
                                                            (
                                                                element,
                                                                index
                                                            ) => (
                                                                <Listbox.Option
                                                                    key={index}
                                                                    className={({
                                                                        active,
                                                                    }) =>
                                                                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                            active
                                                                                ? "bg-amber-100 text-amber-900"
                                                                                : "text-gray-900"
                                                                        }`
                                                                    }
                                                                    value={
                                                                        element
                                                                    }
                                                                >
                                                                    {({
                                                                        selected,
                                                                    }) => (
                                                                        <>
                                                                            <span
                                                                                className={`block truncate ${
                                                                                    selected
                                                                                        ? "font-medium"
                                                                                        : "font-normal"
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    element
                                                                                }
                                                                            </span>
                                                                            {selected ? (
                                                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                                    <CheckIcon
                                                                                        className="h-5 w-5"
                                                                                        aria-hidden="true"
                                                                                    />
                                                                                </span>
                                                                            ) : null}
                                                                        </>
                                                                    )}
                                                                </Listbox.Option>
                                                            )
                                                        )}
                                                    </Listbox.Options>
                                                </Transition>
                                            </div>
                                        </Listbox>
                                    </div>
                                </div>
                                <div className={clsx(styles.footerItem)}>
                                    <div className="mr-3">
                                        {" "}
                                        <span id="currentPage">
                                            {page * selected + 1}-
                                            {totalData <
                                            page * selected + selected
                                                ? totalData
                                                : page * selected + selected}
                                        </span>
                                        <span> of </span>
                                        <span id="total">{totalData}</span>
                                    </div>
                                    <button
                                        disabled={page === 0}
                                        onClick={() =>
                                            handlePageData("previous")
                                        }
                                        className={clsx(styles.controlPage, {
                                            [styles.disableControl]: page === 0,
                                        })}
                                    >
                                        <ChevronLeftIcon></ChevronLeftIcon>
                                    </button>
                                    <button
                                        disabled={
                                            page * selected + selected >=
                                            totalData
                                        }
                                        onClick={() => handlePageData("next")}
                                        className={clsx(styles.controlPage, {
                                            [styles.disableControl]:
                                                page * selected + selected >=
                                                totalData,
                                        })}
                                    >
                                        <ChevronRightIcon></ChevronRightIcon>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryDeleted;
