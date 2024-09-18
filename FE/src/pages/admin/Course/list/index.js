import styles from "./List.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";
import deleteIcon from "../../../../assets/images/delete.svg";
import noDataIcon from "../../../../assets/images/ic_noData.svg";
import viewIcon from "../../../../assets/images/view.svg";
import editIcon from "../../../../assets/images/edit.svg";
import { Fragment, useEffect, useState } from "react";
import * as dataApi from "../../../../api/apiService/dataService";
import Select from "react-select";
import { toast } from "sonner";
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import Modal from "../../../../component/modal";

const selectes = [5, 10, 25];

function ListCourse() {
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [options, setOptions] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);

    const handleRemoveCourse = () => {
        const fetchApi = async () => {
            toast.promise(dataApi.softDeleteCourse(deleteId), {
                loading: "Removing...",
                success: (data) => {
                    setCourses(data.content.content);
                    setTotalData(data.content.totalElements);
                    setPage(0);
                    setSelected(selectes[0]);
                    setDeletedModalOpen(false);
                    return "Remove successfully";
                },
                error: (error) => {
                    return error.content;
                },
            });
        };

        fetchApi();
    };

    const handlePageData = async (action) => {
        const currentTotalData = page * selected + selected;
        let updatePage = page;
        if (action === "next" && currentTotalData < totalData) {
            updatePage += 1;
            setPage(updatePage);
        }
        if (action === "previous" && page > 0) {
            updatePage -= 1;
            setPage(updatePage);
        }
        fetchCourseUpdate(updatePage, selected);
    };

    const handleCloseModal = () => {
        setDeletedModalOpen(false);
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setDeletedModalOpen(true);
    };

    const handleSelectChange = (e) => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getCoursesByCategory(
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

        const debounceApi = debounce(fetchApi, 0);
        debounceApi();
    };

    const fetchCourseUpdate = async (page = this.page, size = selected) => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCourse(page, size);
                setCourses((prev) => result.content.content);
                setTotalData(result.content.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleSelectPageSizeChange = (size) => {
        setSelected((prev) => size);
        fetchCourseUpdate(page, size);
    };
    const handleSearchInputChange = (e) => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getCourseByName(
                    e.target.value,
                    page,
                    selected
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
                let categories = [];
                categories = await dataApi.getAllCategories(0, 99999);
                const result = await dataApi.getAllCourseAdmin(page, selected);
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

    return (
        <div className="flex justify-center w-full ">
            <div className="container mt-4 mx-14">
                <div className="wrapMainDash">
                    <div className={clsx(styles.topMain)}>
                        <div className={clsx(styles.itemTopMain)}>
                            <h4>List</h4>
                        </div>
                        <div className={clsx(styles.itemTopMain)}>
                            <Link
                                to={"/admin/course/create"}
                                className={styles.btnCreate}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="component-iconify MuiBox-root css-1t9pz9x iconify iconify--mingcute"
                                    width="20px"
                                    height="20px"
                                    viewBox="0 0 24 24"
                                >
                                    <g fill="none">
                                        <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                                        <path
                                            fill="currentColor"
                                            d="M11 20a1 1 0 1 0 2 0v-7h7a1 1 0 1 0 0-2h-7V4a1 1 0 1 0-2 0v7H4a1 1 0 1 0 0 2h7z"
                                        ></path>
                                    </g>
                                </svg>
                                New Course
                            </Link>
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
                                    className={clsx(styles.formSelect, "w-52")}
                                >
                                    <label htmlFor="">Category</label>
                                    <Select
                                        onChange={handleSelectChange}
                                        getOptionLabel={(x) => x.name}
                                        getOptionValue={(x) => x.id}
                                        placeholder="All"
                                        options={options}
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
                                                            : `${course.price.toLocaleString(
                                                                  "vi-VN"
                                                              )} VND`}
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
                                                        <Link
                                                            to={`/admin/course/detail/${course.id}`}
                                                        >
                                                            <img
                                                                src={viewIcon}
                                                                alt=""
                                                            />
                                                        </Link>
                                                        <Link
                                                            to={`/admin/course/edit/${course.id}`}
                                                        >
                                                            <img
                                                                src={editIcon}
                                                                alt=""
                                                            />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    course.id
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={deleteIcon}
                                                                alt=""
                                                                className="cursor-pointer"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                {!courses ||
                                    (!courses.length && (
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
                                    ))}
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
                                                                <div
                                                                    key={index}
                                                                >
                                                                    <Listbox.Option
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
                                                                </div>
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
            <Modal
                isOpen={deletedModalOpen}
                closeModal={handleCloseModal}
                title={"Delete"}
                description={"Are you sure want to delete?"}
                handleRemove={handleRemoveCourse}
            ></Modal>
        </div>
    );
}

export default ListCourse;
