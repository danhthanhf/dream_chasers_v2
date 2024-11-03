import styles from "../list/List.module.scss";
import clsx from "clsx";
import restoreIcon from "../../../../assets/images/restore.svg";
import { Fragment, useEffect, useRef, useState } from "react";
import * as adminService from "../../../../api/apiService/adminService";
import * as instructorService from "../../../../api/apiService/instructorService";
import * as publicService from "../../../../api/apiService/publicService";
import { toast } from "sonner";

import DataGridComponent from "../../../../component/table";
import SelectComponent from "../../../../component/select/SelectComponent";
import Modal from "../../../../component/modal";

const selectes = [5, 10, 25];
const reformatCategories = (categories) => {
    let temp = categories.map((cate) => ({
        value: cate.id,
        label: cate.name,
    }));
    temp.unshift({ value: "0", label: "All" });
    return temp;
};

const listStatusCourse = [
    { value: "All", label: "All" },
    { value: "DRAFT", label: "Draft" },
    { value: "PENDING", label: "Pending" },
    { value: "PUBLISHED", label: "Published" },
];

function reFormatCuorse(data) {
    if (!data || data.length === 0) return [];
    return data.map((item) => {
        const create = new Date(item.createdAt);
        const update = new Date(item.updatedAt);
        return {
            id: item.id,
            course: item,
            price: item,
            createdAt: create,
            updatedAt: update,
            actions: item.id,
        };
    });
}

function HistoryDeleted({ isAdmin = true }) {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const isFirstRender = useRef(true);
    const [totalData, setTotalData] = useState(0);
    const [selected, setSelected] = useState(selectes[0]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [page, setPage] = useState(0);
    const [selectedRow, setSelectedRow] = useState([]);
    const [category, setCategory] = useState(0);
    const [statusCourse, setStatusCourse] = useState("ALL");
    const [modalContent, setModalContent] = useState({
        title: "RESOTORE",
        description: "Are you sure want to restore?",
        handleRemove: () => {},
        isOpen: false,
        handleCloseModal: () => {
            setModalContent({ ...modalContent, isOpen: false });
        },
    });
    const [reRender, setReRender] = useState(false);
    const columns = [
        {
            field: "course",
            headerClassName: "theme-header",
            headerName: "Course",
            width: 400,
            type: "string",
            sortable: true,
            sortComparator: (v1, v2) => {
                return v1.title - v2.title;
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
                                    params.value.categories
                                        .map((cate) => cate)
                                        .join(", ")}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            headerClassName: "theme-header",
            field: "createdAt",
            headerName: "Create At",
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
            field: "updatedAt",
            headerClassName: "theme-header",
            headerName: "Updated At",
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
            field: "actions",
            headerClassName: "theme-header",
            width: 100,
            type: "actions",
            renderCell: (params) => {
                return (
                    <div
                        className={clsx(
                            styles.field,
                            "flex items-center h-full"
                        )}
                    >
                        <div className={clsx(styles.name, "flex gap-4")}>
                            <button
                                type="button"
                                onClick={() => {
                                    setModalContent({
                                        ...modalContent,
                                        title: "RESTORE",
                                        isOpen: true,
                                        description:
                                            "Are you sure want to restore",
                                        handleRemove: () =>
                                            handleRestoreCourse(params.value),
                                    });
                                }}
                            >
                                <img src={restoreIcon} alt="" />
                            </button>
                        </div>
                    </div>
                );
            },
        },
    ];
    const handlePageData = async (action) => {
        setPage(action.page);
        setSelected(action.pageSize);
    };

    const handleCategoryChange = (e) => {
        setCategory(e);
    };

    const handleRestoreCourse = (id) => {
        let api = adminService;
        if (!isAdmin) {
            api = instructorService;
        }
        toast.promise(api.restoreCourseById(id, page, selected), {
            loading: "loading...",
            success: (data) => {
                setReRender(!reRender);
                setModalContent({ ...modalContent, isOpen: false });
                return "Restore success";
            },
            error: (error) => {
                console.log(error);
                return error.mess;
            },
        });
    };

    const handleSearchInputChange = (e) => {
        let api = adminService;
        if (!isAdmin) {
            api = instructorService;
        }
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                const result = await api.getAvailableCourseByNameAndCategory(
                    e.target.value,
                    category,
                    page,
                    selected,
                    true
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

    const fetchApiToGetCategories = async () => {
        try {
            let categories = [];
            categories = await publicService.getAllCategories(false, 0, 99999);
            let categoriesFormat = reformatCategories(categories.content);
            setCategories(categoriesFormat);
            setCategory(categoriesFormat[0].value);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        if (isFirstRender.current) {
            fetchApiToGetCategories();
            isFirstRender.current = false;
        }
        setIsLoadingData(true);
        let api = adminService;
        if (!isAdmin) {
            api = instructorService;
        }
        const fetchApi = async () => {
            try {
                const result = await api.getCoursesByCategoryAndStatus(
                    true,
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
    }, [page, selected, reRender, category, statusCourse]);

    // useEffect(() => {

    //     setIsLoadingData(true);
    //     let api = adminService;
    //     if (!isAdmin) {
    //         api = instructorService;
    //     }
    //     const fetchApi = async () => {
    //         try {
    //             let categories = [];
    //             categories = await api.getAllCategories(false, 0, 99999);
    //             const result = await api.getAllCourseDeleted(page, selected);
    //             setCourses(result.content);
    //             setTotalData(result.totalElements);
    //             let categoriesFormat = reformatCategories(categories.content);
    //             setCategories(categoriesFormat);
    //             setCategory(categoriesFormat[0].value);
    //         } catch (error) {
    //             console.log(error);
    //         } finally {
    //             setIsLoadingData(false);
    //         }
    //     };
    //     fetchApi();
    // }, []);

    const handleRowSelection = (selectionModel) => {
        setSelectedRow(selectionModel);
    };

    const handleRestoreListCourse = async () => {
        let api = adminService;
        if (!isAdmin) {
            api = instructorService;
        }
        toast.promise(api.restoreListCourse(selectedRow), {
            loading: "Resotoring...",
            success: () => {
                setReRender(!reRender);
                setModalContent({ ...modalContent, isOpen: false });
                return "Restore successfully";
            },
            error: (error) => {
                console.log(error);
                return error.message;
            },
        });
    };

    const openDeleteModal = (id) => {
        setModalContent({
            ...modalContent,
            isOpen: true,
            handleRemove: handleRestoreListCourse,
            description: `Are you sure want to delete ${selectedRow.length} user?`,
        });
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
                                                src={restoreIcon}
                                                alt=""
                                                className="w-5 h-5"
                                            />
                                        </button>
                                        <span className="text-xs font-semibold text-[#22c55e]">
                                            Restore ({selectedRow.length})
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
                description={modalContent.description}
            ></Modal>
        </div>
    );
}

export default HistoryDeleted;
