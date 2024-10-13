import clsx from "clsx";
import styles from "../../Course/list/List.module.scss";
import { Fragment, useEffect, useRef, useState } from "react";
import avatar from "../../../../assets/images/avatar_25.jpg";
import viewIcon from "../../../../assets/images/view.svg";
import { Menu, Transition } from "@headlessui/react";

import * as dataService from "../../../../api/apiService/dataService";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import DataGridComponent from "../../../../component/table";

function Dropdown({ postId, status, handleProcessStatus, isLastItem = false }) {
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
                            "bg-custom z-10 absolute w-40 right-0 mt-2origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none",
                            {
                                "top-8": !isLastItem,
                                "top-[99px]": isLastItem,
                            }
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

const updatPostStatus = (dataPost, post, status) => {
    const updatePosts = { ...dataPost };
    switch (status) {
        case "APPROVED": {
            post.status === "PENDIND"
                ? updatePosts.totalPending--
                : updatePosts.totalRejected--;
            updatePosts.totalApproved++;
            break;
        }
        default:
            post.status === "REJECTED"
                ? updatePosts.totalPending--
                : updatePosts.totalApproved--;
            updatePosts.totalRejected++;
            break;
    }
    post.status = status;
    updatePosts.posts.map((p) => {
        if (p.id === post.id) {
            post.status = status;
        }
        return p;
    });
    return updatePosts;
};

function reFormat(data) {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
        const create = new Date(item.createdAt);
        return {
            id: item.id,
            title: item.title,
            user: item,
            createdAt: create,
            status: item.status,
            actions: item,
        };
    });
}

let timerId = null;
const selectes = [5, 10, 25];

function ListPost() {
    const [posts, setPosts] = useState([]);
    const [selectedRow, setSelectedRow] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [selectedSize, setSelectedSize] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState("ALL");
    const [postSelected, setPostSelected] = useState();
    const [isOpen, setIsOpen] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);

    const columns = [
        {
            field: "title",
            headerName: "Title",
            headerClassName: "theme-header",
            width: 372,
            type: "string",
            sortable: true,
        },
        {
            field: "user",
            headerName: "User",
            headerClassName: "theme-header",
            type: "string",
            sortable: true,
            width: 240,
            renderCell: (params) => {
                return (
                    <div
                        className={clsx(
                            styles.field,
                            "flex items-center h-full"
                        )}
                    >
                        <div className={clsx(styles.cssImg)}>
                            <img
                                src={
                                    params.value.userAvatar
                                        ? params.value.userAvatar
                                        : avatar
                                }
                                alt=""
                            />
                        </div>
                        <div>
                            <div className={clsx(styles.name)}>
                                {params.value.userName}
                            </div>
                            <div className={clsx(styles.categories)}>
                                {params.value.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            field: "createdAt",
            headerName: "Create At",
            headerClassName: "theme-header",
            sortable: true,
            type: "dateTime",
            width: 220,
            renderCell: (params) => {
                const date = params.value.toLocaleDateString();
                const time = params.value.toLocaleTimeString();
                return <>{date + "" + time}</>;
            },
        },
        {
            field: "status",
            headerName: "Status",
            headerClassName: "theme-header",
            sortable: true,
            type: "string",
            width: 120,
            renderCell: (params) => {
                return (
                    <div className={clsx(styles.name)}>
                        <span
                            className={clsx("text-xs", {
                                tagPending: params.value === "PENDING",
                                tagApproved: params.value === "APPROVED",
                                tagRejected: params.value === "REJECTED",
                            })}
                        >
                            {params.value}
                        </span>
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerClassName: "theme-header",
            width: 150,
            type: "actions",
            cellClassName: () => clsx("overflow-visible"),
            renderCell: (params) => {
                return (
                    <div
                        className={clsx(
                            styles.name,
                            "flex justify-center items-center gap-1.5"
                        )}
                    >
                        <Link
                            to={`/admin/post/detail/${encodeURIComponent(
                                params.value.title
                            )}`}
                        >
                            <img className="w-[20px]" src={viewIcon} alt="" />
                        </Link>

                        <div
                            className="py-1 px-1 justify-center itesm-center  rounded-full focus:outline-none cursor-pointer hover:bg-gray-300 hover:opacity-80 transition-all delay-50 ease-in menu-button"
                            onClick={(e) =>
                                handleMenuButtonClick(e, params.value)
                            }
                        >
                            {" "}
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
                        </div>
                    </div>
                );
            },
        },
    ];

    const handleSearchInputChange = async (e) => {
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                let data;
                if (e.target.value === "") {
                    data = await dataService.getAllPost(
                        status,
                        page,
                        selectedSize
                    );
                    setPosts(data);
                } else {
                    data = await dataService.searchPostByTitle(
                        e.target.value,
                        status,
                        page,
                        selectedSize
                    );
                    setPosts({ ...posts, posts: data.content });
                }
            } catch (error) {
                console.log(error);
                toast.error("Error search");
            } finally {
                setIsLoadingData(false);
            }
        };
        const debounceApi = debounce(fetchApi, 300);
        debounceApi();
    };

    const handlePageData = async (action) => {
        setSelectedSize(action.pageSize);
        setPage(action.page);
    };

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
                setIsLoadingData(true);
                const data = await dataService.getAllPost(
                    status,
                    page,
                    selectedSize
                );
                setPosts(data);
                switch (status) {
                    case "ALL":
                        setTotalData(data.totalElement);
                        break;
                    case "APPROVED":
                        setTotalData(data.totalApproved);
                        break;
                    case "PENDING":
                        setTotalData(data.totalPending);
                        break;
                    default:
                        setTotalData(data.totalRejected);
                        break;
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchApi();

        const handleClickOutside = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target) &&
                !event.target.closest(".menu-button")
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [page, selectedSize, status]);

    const handleProcessStatus = async (status) => {
        if (postSelected.status === status) {
            return;
        }
        toast.promise(
            dataService.processStatusPost(
                postSelected.id,
                status,
                page,
                selectedSize
            ),
            {
                loading: "Processing...",
                success: () => {
                    const updatedPosts = updatPostStatus(
                        posts,
                        postSelected,
                        status
                    );
                    setPosts(updatedPosts);
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

    const handleRowSelection = (selectionModel) => {
        setSelectedRow(selectionModel);
    };

    const handleMenuButtonClick = (event, post) => {
        event.stopPropagation();
        setIsOpen((prev) => !prev);
        setPostSelected(post);
        positionMenu(event);
    };

    const positionMenu = (event) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.right + window.scrollX - 160,
        });
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
                        <div className="flex flex-col b-shadow-light rounded-lg">
                            <div className="flex gap-4 px-3  text-sm border-b-2 border-gray-100 mb-3">
                                <div
                                    onClick={() => handleChangeStatus("ALL")}
                                    className={clsx(
                                        "py-3 cursor-pointer text-gray-500 font-medium",
                                        {
                                            "border-b-2 border-black text-black":
                                                status === "ALL",
                                        }
                                    )}
                                >
                                    All
                                    <span className="ml-1.5 text-xs px-1.5 py-0.5 font-semibold  text-white rounded-md bg-black">
                                        {posts.totalElement || 0}
                                    </span>
                                </div>
                                <div
                                    onClick={() =>
                                        handleChangeStatus("APPROVED")
                                    }
                                    className={clsx(
                                        "py-3 cursor-pointer text-gray-500 font-medium",
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
                                        {posts.totalApproved || 0}
                                    </span>
                                </div>
                                <div
                                    onClick={() =>
                                        handleChangeStatus("PENDING")
                                    }
                                    className={clsx(
                                        "py-3 cursor-pointer text-gray-500 font-medium",
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
                                        {posts.totalPending || 0}
                                    </span>
                                </div>
                                <div
                                    onClick={() =>
                                        handleChangeStatus("REJECTED")
                                    }
                                    className={clsx(
                                        "py-3 cursor-pointer text-gray-500 font-medium",
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
                                        {posts.totalRejected || 0}
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
                            <div>
                                <DataGridComponent
                                    columns={columns}
                                    rows={reFormat(posts.posts)}
                                    totalElements={totalData}
                                    handleRowSelection={handleRowSelection}
                                    isLoading={isLoadingData}
                                    paginationModel={{
                                        pageSize: selectedSize,
                                        page: page,
                                    }}
                                    setPaginationModel={handlePageData}
                                ></DataGridComponent>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isOpen && (
                <div
                    ref={menuRef}
                    className="bg-custom absolute z-10 w-40 mt-2 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                    }}
                >
                    <div className="px-1 py-1">
                        <button
                            onClick={() => handleProcessStatus("APPROVED")}
                            className="font-medium group flex w-full text-green-500 items-center rounded-md px-2 py-2.5 text-sm hover:opacity-75 hover:bg-gray-200"
                        >
                            Approve
                        </button>
                        <button
                            onClick={() => {
                                handleProcessStatus("REJECTED");
                            }}
                            className="hover:opacity-75 hover:bg-gray-200 font-medium group flex text-red-600 w-full items-center rounded-md px-2 py-2.5 text-sm"
                        >
                            Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListPost;
