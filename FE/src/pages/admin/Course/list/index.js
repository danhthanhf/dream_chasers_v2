import styles from "./List.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";
import SelectComponent from "../../../../component/select/SelectComponent";
import deleteIcon from "../../../../assets/images/delete.svg";
import viewIcon from "../../../../assets/images/view.svg";
import editIcon from "../../../../assets/images/edit.svg";
import { useEffect, useRef, useState } from "react";
import * as adminService from "../../../../api/apiService/adminService";
import { toast } from "sonner";

import Modal from "../../../../component/modal";
import DataGridComponent from "../../../../component/table";
import Ink from "react-ink";

const selectes = [5, 10, 25];

function reFormatCuorse(data) {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
        const create = new Date(item.createdAt);
        return {
            id: item.id,
            course: item,
            price: item,
            createdAt: create,
            status: item,
            actions: item,
        };
    });
}

const listStatusCourse = [
    { value: "ALL", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "PENDING", label: "Pending" },
    { value: "REJECTED", label: "Rejected" },
    { value: "PUBLISHED", label: "Published" },
];

function ListCourse() {
    const [courses, setCourses] = useState([]);
    const [statusCourse, setStatusCourse] = useState("ALL");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(0);
    const [totalData, setTotalData] = useState(0);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [reRender, setReRender] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [courseSelected, setCourseSelected] = useState();
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef(null);
    const [modalContent, setModalContent] = useState({
        title: "DELETE",
        description: "Are you sure want to delete?",
        isReject: false,
        handleRemove: () => {},
        isOpen: false,
        handleCloseModal: () => {
            setModalContent({ ...modalContent, isOpen: false });
        },
    });
    const columns = [
        {
            field: "course",
            headerName: "Course",
            headerClassName: "theme-header",
            width: 346,
            type: "string",
            sortable: true,
            sortComparator: (v1, v2) => {
                return v1.title.localeCompare(v2.title);
            },
            renderCell: (params) => {
                return (
                    <div
                        className={clsx(
                            styles.field,
                            "flex h-full items-center"
                        )}
                    >
                        <div className={clsx(styles.cssImg)}>
                            <img src={params.value.thumbnail} alt="" />
                        </div>
                        <div className="overflow-hidden">
                            <div
                                className={clsx(styles.name, "overflow-hidden")}
                            >
                                {params.value.title}
                            </div>
                            <div className={clsx(styles.categories)}>
                                {params.value.categories &&
                                    params.value.categories.join(", ")}
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
                return <>{date + " - " + time}</>;
            },
        },
        {
            field: "price",
            headerName: "Price",
            headerClassName: "theme-header",
            sortable: true,
            sortComparator: (v1, v2) => {
                if (v1.price === "Free" && v2.price === "Free") return 0;
                if (v1.price === "Free") return -1;
                if (v2.price === "Free") return 1;

                const price1 = parseFloat(v1.price);
                const price2 = parseFloat(v2.price);

                return price1 - price2;
            },
            width: 250,
            renderCell: (params) => {
                return params.value.price === 0
                    ? "Free"
                    : `${params.value.price.toLocaleString("vi-VN")} VND (${
                          params.value.tier
                      })`;
            },
        },
        {
            field: "status",
            headerName: "Status",
            headerClassName: "theme-header",
            sortable: false,
            type: "string",
            width: 180,
            renderCell: (params) => {
                return (
                    <div className={clsx(styles.name)}>
                        <span
                            className={clsx("text-xs", {
                                tagPending: params.value.status == "PENDING",
                                "text-gray-700 bg-gray-300 px-2 py-[2px] rounded-md":
                                    params.value.status == "DRAFT",
                                tagApproved: params.value.status == "PUBLISHED",
                                tagRejected: params.value.status == "REJECTED",
                            })}
                        >
                            {params.value.status}
                        </span>
                    </div>
                );
            },
        },
        {
            field: "actions",
            headerClassName: "theme-header",
            width: 180,
            type: "actions",
            renderCell: (params) => {
                return (
                    <div
                        className={clsx(
                            styles.field,
                            "flex items-center h-full"
                        )}
                    >
                        <div
                            className={clsx(
                                styles.name,
                                "flex gap-4 items-center"
                            )}
                        >
                            {/* <Link
                                to={`/admin/course/detail/${params.value.id}`}
                            >
                                <img src={viewIcon} alt="" />
                            </Link> */}
                            <Link to={`/admin/course/edit/${params.value.id}`}>
                                <img src={editIcon} alt="" />
                            </Link>
                            <button
                                onClick={() => {
                                    setModalContent({
                                        ...modalContent,
                                        title: "DELETE",
                                        isOpen: true,
                                        description:
                                            "Are you sure want to delete",
                                        handleRemove: () =>
                                            handleRemoveCourse(params.value.id),
                                    });
                                }}
                            >
                                <img
                                    src={deleteIcon}
                                    alt=""
                                    className="cursor-pointer"
                                />
                            </button>
                            <div
                                className="py-1 px-1 justify-center itesm-center  rounded-full focus:outline-none cursor-pointer hover:bg-gray-300 hover:opacity-80 transition-all delay-50 ease-in menu-button relative"
                                onClick={(e) =>
                                    handleMenuButtonClick(e, params.value)
                                }
                            >
                                {" "}
                                <Ink></Ink>
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
                    </div>
                );
            },
        },
    ];

    const positionMenu = (event) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.right + window.scrollX - 160,
        });
    };

    const handleMenuButtonClick = (event, course) => {
        event.stopPropagation();

        setIsOpen((prev) => !prev);
        setCourseSelected(course);
        positionMenu(event);
    };

    const handleRemoveCourse = (deleteId) => {
        const fetchApi = async () => {
            toast.promise(
                adminService.softDeleteCourse(deleteId, page, selected),
                {
                    loading: "Removing...",
                    success: (data) => {
                        setReRender(!reRender);
                        setModalContent({ ...modalContent, isOpen: false });
                        return "Remove successfully";
                    },
                    error: (error) => {
                        return error.message;
                    },
                }
            );
        };

        fetchApi();
    };

    const handlePageData = async (action) => {
        setPage(action.page);
        setSelected(action.pageSize);
    };

    const handleRemoveCourses = async () => {
        toast.promise(adminService.softDeleteCourses(selectedRow), {
            loading: "Removing...",
            success: () => {
                setReRender(!reRender);
                setModalContent({ ...modalContent, isOpen: false });
                return "Remove successfully";
            },
            error: (error) => {
                console.log(error);
                return error.content;
            },
        });
    };

    const openDeleteModal = () => {
        console.log("object");
        setModalContent({
            ...modalContent,
            isOpen: true,
            handleRemove: handleRemoveCourses,
            description: `Are you sure want to delete ${selectedRow.length} user?`,
        });
    };

    const handleSearchInputChange = (e) => {
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                const result =
                    await adminService.getAvailableCourseByNameAndCategory(
                        e.target.value,
                        category,
                        page,
                        selected
                    );
                setCourses(result.content);

                setTotalData(result.totalElements);
                setIsLoadingData(false);
            } catch (error) {
                console.log(error);
                setIsLoadingData(false);
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

    const handleRowSelection = (selectionModel) => {
        setSelectedRow(selectionModel);
    };

    const handleCategoryChange = (e) => {
        if (e === null) return;
        setCategory(e);
    };

    const reformatCategories = (categories) => {
        let temp = categories.map((cate) => ({
            value: cate.id,
            label: cate.name,
        }));
        temp.unshift({ value: "0", label: "All" });
        return temp;
    };

    const handleChangeStatusCourse = async (status, titleReasons) => {
        status = status.toUpperCase();

        if (courseSelected.status === status) {
            return;
        }

        toast.promise(
            adminService.processStatusCourse(
                courseSelected.id,
                status,
                titleReasons,
                {}
            ),
            {
                loading: "Processing...",
                success: () => {
                    const updateCourse = courses.map((course) => {
                        if (course.id === courseSelected.id) {
                            if (
                                status == "PUBLISHED" &&
                                course.status == "DRAFT"
                            )
                                course.status = "PENDING";
                            else course.status = status;
                        }
                        return course;
                    });
                    setModalContent({ ...modalContent, isOpen: false });
                    setCourses(updateCourse);
                    return "Process success";
                },
                error: (error) => {
                    console.log(error);
                    return "Process error";
                },
            }
        );
    };

    useEffect(() => {
        setIsLoadingData(true);

        const fetchApi = async () => {
            try {
                const result = await adminService.getCoursesByCategoryAndStatus(
                    false,
                    category,
                    statusCourse,
                    page,
                    selected
                );
                setCourses(result.content);
                setTotalData(result.totalElements);
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
    }, [page, selected, category, reRender, statusCourse]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                let categories = [];
                categories = await adminService.getAllCategories(
                    false,
                    0,
                    99999
                );
                const result = await adminService.getAllCourseAdmin(
                    page,
                    selected
                );
                setCourses(result.content);
                setTotalData(result.totalElements);
                let categoriesFormat = reformatCategories(categories.content);
                setCategories(categoriesFormat);
                setCategory(categoriesFormat[0].value);
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

                    <div className="formGroup flex flex-col gap-3 ">
                        <div
                            className={clsx(
                                styles.contentMain,
                                "flex justify-between gap-3 items-center"
                            )}
                        >
                            <div className={clsx(styles.contentItem)}>
                                <div
                                    className={clsx(
                                        styles.formSelect,
                                        "focus:border-black hover:border-black border-gray-300 w-52"
                                    )}
                                >
                                    <label htmlFor="">Category</label>
                                    <SelectComponent
                                        value={category}
                                        handleChange={handleCategoryChange}
                                        placeholder="All"
                                        data={categories}
                                    />
                                </div>
                            </div>
                            <div className={clsx(styles.contentItem)}>
                                <div
                                    className={clsx(
                                        styles.formSelect,
                                        "focus:border-black hover:border-black border-gray-300 w-52"
                                    )}
                                >
                                    <label htmlFor="">Status</label>
                                    <SelectComponent
                                        value={statusCourse}
                                        handleChange={(e) => setStatusCourse(e)}
                                        placeholder="All"
                                        data={listStatusCourse}
                                    />
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    "w-[160px] h-full flex items-center gap-1 cursor-pointer hover:opacity-70"
                                )}
                                onClick={openDeleteModal}
                            >
                                {selectedRow.length > 0 && (
                                    <>
                                        <button type="button">
                                            <img
                                                src={deleteIcon}
                                                alt=""
                                                className="w-5 h-5"
                                            />
                                        </button>
                                        <span className="text-xs font-semibold text-[#ff5630]">
                                            Delete ({selectedRow.length})
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className={clsx(styles.contentItem, "flex-1")}>
                                <div
                                    id="seachWrap"
                                    className={clsx(styles.search, "ml-0")}
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
                                rows={reFormatCuorse(courses)}
                                totalElements={totalData}
                                handleRowSelection={handleRowSelection}
                                isLoading={isLoadingData}
                                paginationModel={{
                                    pageSize: selected,
                                    page: page,
                                }}
                                setPaginationModel={handlePageData}
                            ></DataGridComponent>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalContent.isOpen}
                closeModal={modalContent.handleCloseModal}
                handleRemove={modalContent.handleRemove}
                title={modalContent.title}
                isReject={modalContent.isReject}
                description={modalContent.description}
            ></Modal>
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
                            onClick={() =>
                                handleChangeStatusCourse("PUBLISHED")
                            }
                            className="relative font-medium group flex w-full text-green-500 items-center rounded-md px-2 py-2.5 text-sm hover:opacity-75 hover:bg-gray-200"
                        >
                            <Ink></Ink>
                            Publish
                        </button>
                        <button
                            onClick={() => {
                                setModalContent({
                                    ...modalContent,
                                    title: "REJECT",
                                    isOpen: true,
                                    isReject: true,
                                    handleRemove: handleChangeStatusCourse,
                                });
                            }}
                            className="relative hover:opacity-75 hover:bg-gray-200 font-medium group flex text-red-500 w-full items-center rounded-md px-2 py-2.5 text-sm"
                        >
                            <Ink></Ink>
                            Reject
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ListCourse;
