import clsx from "clsx";
import styles from "../../Course/list/List.module.scss";
import { Fragment, useEffect, useState } from "react";
import avatar from "../../../../assets/images/avatar_25.jpg";
import noDataIcon from "../../../../assets/images/ic_noData.svg";
import viewIcon from "../../../../assets/images/view.svg";
import { Listbox, Menu, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import * as DataApi from "../../../../api/apiService/dataService";
import { toast } from "sonner";
import { Link } from "react-router-dom";

function Dropdown({ postId, status, handleProcessStatus }) {
    return (
        <div className="text-right flex">
            <Menu as="div" className="relative text-left flex ml-2">
                <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                        />
                    </svg>
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        className={clsx(
                            " z-10 absolute top-8 w-40 right-0 mt-2origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                        )}
                    >
                        <div className="px-1 py-1">
                            {status !== "APPROVED" && (
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            onClick={() =>
                                                handleProcessStatus(
                                                    postId,
                                                    "APPROVED"
                                                )
                                            }
                                            className={`${
                                                active && "bg-green-100"
                                            } font-medium group flex w-full text-green-500 items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                            {active ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="mr-4 w-4 h-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m4.5 12.75 6 6 9-13.5"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="mr-4 w-4 h-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m4.5 12.75 6 6 9-13.5"
                                                    />
                                                </svg>
                                            )}
                                            Approve
                                        </button>
                                    )}
                                </Menu.Item>
                            )}
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => {
                                            handleProcessStatus(
                                                postId,
                                                "REJECTED"
                                            );
                                        }}
                                        className={`${
                                            active && "bg-red-100"
                                        } font-medium group flex text-red-600 w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                    >
                                        {active ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="mr-4 w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18 18 6M6 6l12 12"
                                                />
                                            </svg>
                                        ) : (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                                className="mr-4 w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M6 18 18 6M6 6l12 12"
                                                />
                                            </svg>
                                        )}
                                        Reject
                                    </button>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}

let timerId = null;
const selectes = [5, 10, 25];

function ListPost() {
    const [result, setReult] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selectedSize, setSelectedSize] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState("ALL");

    const handleSearchInputChange = async (e) => {
        const fetchApi = async () => {
            try {
                let data;
                if (e.target.value === "") {
                    data = await DataApi.getAllPost(status, page, selectedSize);
                    setReult(data.content);
                    setTotalData(data.content.totalElement);
                } else {
                    data = await DataApi.searchPostByTitle(
                        e.target.value,
                        status,
                        page,
                        selectedSize
                    );
                    setReult({ ...result, posts: data.content.content });
                    setTotalData(data.content.totalElements);
                }
            } catch (error) {
                console.log(error);
                toast.error("Error search");
            }
        };
        const debounceApi = debounce(fetchApi, 300);
        debounceApi();
    };

    const handlePageData = async (action) => {
        const currentTotalData = page * selectedSize + selectedSize;
        let updatePage = page;
        if (action === "next" && currentTotalData < totalData) {
            updatePage += 1;
            setPage(updatePage);
        }
        if (action === "previous" && page > 0) {
            updatePage -= 1;
            setPage(updatePage);
        }
        fetchInvoicesUpdate(updatePage, selectedSize);
    };

    const debounce = (func, delay = 600) => {
        return () => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func();
            }, delay);
        };
    };

    const fetchInvoicesUpdate = async () => {
        const fetchApi = async () => {
            try {
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleSelectPageSizeChange = (size) => {
        setSelectedSize((prev) => size);
        fetchInvoicesUpdate(page, size);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const data = await DataApi.getAllPost(
                    status,
                    page,
                    selectedSize
                );
                setReult(data.content);
                switch (status) {
                    case "ALL":
                        setTotalData(data.content.totalElement);
                        break;
                    case "APPROVED":
                        setTotalData(data.content.totalApproved);
                        break;
                    case "PENDING":
                        setTotalData(data.content.totalPending);
                        break;
                    default:
                        setTotalData(data.content.totalRejected);
                        break;
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [page, selectedSize, status]);

    const handleProcessStatus = async (postId, status) => {
        toast.promise(
            DataApi.processStatusPost(postId, status, page, selectedSize),
            {
                loading: "Processing...",
                success: (result) => {
                    setReult(result.content);
                    setTotalData(result.content.totalElement);
                    return "Process success";
                },
                error: (error) => {
                    console.log(error);
                    return "Process error";
                },
            }
        );
    };

    const handleChangeStatus = (status) => {
        setStatus(status);
        setPage(0);
        setSelectedSize(selectes[0]);
    };

    return (
        <div>
            <div className="flex justify-center w-full ">
                <div className="container mt-4 mx-14">
                    <div className="wrapMainDash">
                        <div className={clsx(styles.topMain)}>
                            <div className={clsx(styles.itemTopMain)}>
                                <h4>List</h4>
                            </div>
                            <div className={clsx(styles.itemTopMain)}></div>
                        </div>

                        <div className="flex py-3 flex-col b-shadow-light rounded-lg">
                            <div className="flex gap-4 px-3  text-sm border-b-2 border-gray-100 mb-3">
                                <div
                                    onClick={() => handleChangeStatus("ALL")}
                                    className={clsx(
                                        "pb-3 cursor-pointer text-gray-500 font-medium",
                                        {
                                            "border-b-2 border-black text-black":
                                                status === "ALL",
                                        }
                                    )}
                                >
                                    All
                                    <span className="ml-1.5 text-xs px-1.5 py-0.5 font-semibold  text-white rounded-md bg-black">
                                        {result.totalElement}
                                    </span>
                                </div>
                                <div
                                    onClick={() =>
                                        handleChangeStatus("APPROVED")
                                    }
                                    className={clsx(
                                        "pb-3 cursor-pointer text-gray-500 font-medium",
                                        {
                                            "border-b-2 border-black text-black":
                                                status === "APPROVED",
                                        }
                                    )}
                                >
                                    Approved
                                    <span
                                        className={clsx(
                                            "ml-1.5 text-xs px-1.5 py-0.5 font-semibold rounded-md text-green-500  bg-green-100",
                                            {
                                                "bg-green-500 text-white":
                                                    status === "APPROVED",
                                            }
                                        )}
                                    >
                                        {result.totalApproved}
                                    </span>
                                </div>
                                <div
                                    onClick={() =>
                                        handleChangeStatus("PENDING")
                                    }
                                    className={clsx(
                                        "pb-3 cursor-pointer text-gray-500 font-medium",
                                        {
                                            "border-b-2 border-black text-black":
                                                status === "PENDING",
                                        }
                                    )}
                                >
                                    Pending
                                    <span
                                        className={clsx(
                                            "ml-1.5 text-xs px-1.5 py-0.5 font-semibold  text-yellow-500 rounded-md bg-yellow-100",
                                            {
                                                "bg-yellow-500 text-white":
                                                    status === "PENDING",
                                            }
                                        )}
                                    >
                                        {result.totalPending}
                                    </span>
                                </div>
                                <div
                                    onClick={() =>
                                        handleChangeStatus("REJECTED")
                                    }
                                    className={clsx(
                                        "pb-3 cursor-pointer text-gray-500 font-medium",
                                        {
                                            "border-b-2 border-black text-black":
                                                status === "REJECTED",
                                        }
                                    )}
                                >
                                    Rejected
                                    <span
                                        className={clsx(
                                            "ml-1.5 px-1.5 py-0.5 font-semibold  text-red-500 rounded-md bg-red-100",
                                            {
                                                "bg-red-500 text-white":
                                                    status === "REJECTED",
                                            }
                                        )}
                                    >
                                        {result.totalRejected || 0}
                                    </span>
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    styles.contentMain,
                                    "flex justify-between px-3 mb-3"
                                )}
                            >
                                <div
                                    className={clsx(
                                        styles.contentItem,
                                        "flex-auto"
                                    )}
                                >
                                    <div
                                        id="seachWrap"
                                        className={clsx(styles.search, "mr-4")}
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
                                        "flex px-3 rounded-lg "
                                    )}
                                >
                                    <div className="col-lg-1">Id</div>
                                    <div className="col-lg-3">User</div>
                                    <div className="col-lg-4">Title</div>
                                    <div className="col-lg-2">Create at</div>
                                    <div className="col-lg-1">Status</div>
                                </div>
                                <div className={clsx(styles.containerData)}>
                                    {result?.posts?.map((element, index) => {
                                        let status;
                                        if (element.status === "PENDING") {
                                            status = "Pending";
                                        } else if (
                                            element.status === "APPROVED"
                                        ) {
                                            status = "Approved";
                                        } else {
                                            status = "Rejected";
                                        }
                                        const dateTime = new Date(
                                            element.createAt
                                        );
                                        const date =
                                            dateTime.toLocaleDateString();
                                        const time =
                                            dateTime.toLocaleTimeString();
                                        return (
                                            <div
                                                key={index}
                                                className={clsx(
                                                    styles.item,
                                                    "rounded-lg row gy-2 gx-1  px-3"
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
                                                        {element.id}
                                                    </div>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-3 flex "
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.cssImg
                                                        )}
                                                    >
                                                        <img
                                                            src={
                                                                element.userAvatar
                                                                    ? element.userAvatar
                                                                    : avatar
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
                                                            {element.userName}
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                styles.categories
                                                            )}
                                                        >
                                                            {element.email}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-4 flex text-sm line-clamp-1 "
                                                    )}
                                                >
                                                    {element.title}
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
                                                        "col-lg-1"
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.name
                                                        )}
                                                    >
                                                        <span
                                                            className={clsx(
                                                                "text-xs",
                                                                {
                                                                    tagPending:
                                                                        element.status ===
                                                                        "PENDING",
                                                                    tagApproved:
                                                                        element.status ===
                                                                        "APPROVED",
                                                                    tagRejected:
                                                                        element.status ===
                                                                        "REJECTED",
                                                                }
                                                            )}
                                                        >
                                                            {status}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-1"
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.name,
                                                            "flex justify-center gap-1.5"
                                                        )}
                                                    >
                                                        <Link
                                                            to={`/admin/post/detail/${encodeURIComponent(
                                                                element.title
                                                            )}`}
                                                        >
                                                            <img
                                                                src={viewIcon}
                                                                alt=""
                                                            />
                                                        </Link>
                                                        <Dropdown
                                                            postId={element.id}
                                                            status={
                                                                element.status
                                                            }
                                                            handleProcessStatus={
                                                                handleProcessStatus
                                                            }
                                                        ></Dropdown>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {!result ||
                                        (!result?.posts?.length && (
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
                                                value={selectedSize}
                                                onChange={
                                                    handleSelectPageSizeChange
                                                }
                                            >
                                                <div className="relative mt-1">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                        <span className="block truncate">
                                                            {selectedSize}
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
                                                            {selectes?.map(
                                                                (
                                                                    element,
                                                                    index
                                                                ) => (
                                                                    <Listbox.Option
                                                                        key={
                                                                            index
                                                                        }
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
                                            <span id="currentPage">
                                                {page * selectedSize + 1}-
                                                {totalData <
                                                page * selectedSize +
                                                    selectedSize
                                                    ? totalData
                                                    : page * selectedSize +
                                                      selectedSize}
                                            </span>
                                            <span> of </span>
                                            <span id="total">{totalData}</span>
                                        </div>
                                        <button
                                            disabled={page === 0}
                                            onClick={() =>
                                                handlePageData("previous")
                                            }
                                            className={clsx(
                                                styles.controlPage,
                                                {
                                                    [styles.disableControl]:
                                                        page === 0,
                                                }
                                            )}
                                        >
                                            <ChevronLeftIcon></ChevronLeftIcon>
                                        </button>
                                        <button
                                            disabled={
                                                page * selectedSize +
                                                    selectedSize >=
                                                totalData
                                            }
                                            onClick={() =>
                                                handlePageData("next")
                                            }
                                            className={clsx(
                                                styles.controlPage,
                                                {
                                                    [styles.disableControl]:
                                                        page * selectedSize +
                                                            selectedSize >=
                                                        totalData,
                                                }
                                            )}
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
        </div>
    );
}

export default ListPost;
