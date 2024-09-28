import styles from "./List.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";
import SelectComponent from "../../../../component/select/SelectComponent";
import deleteIcon from "../../../../assets/images/delete.svg";
import viewIcon from "../../../../assets/images/view.svg";
import editIcon from "../../../../assets/images/edit.svg";
import { Fragment, useEffect, useState } from "react";
import * as dataApi from "../../../../api/apiService/dataService";
import { toast } from "sonner";

import Modal from "../../../../component/modal";
import DataGridComponent from "../../../../component/table";

const selectes = [5, 10, 25];

function reFormatCuorse(data) {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
        const create = new Date(item.createdAt);
        const update = new Date(item.updatedAt);
        return {
            id: item.id,
            course: item,
            price: item.price,
            createdAt: create,
            updatedAt: update,
            actions: item.id,
        };
    });
}

function ListCourse() {
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState();
    const [totalData, setTotalData] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const columns = [
        {
            field: "course",
            headerName: "Course",
            headerClassName: "theme-header",
            width: 316,
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
                                        .map((cate) => cate.name)
                                        .join(", ")}
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
            field: "updatedAt",
            headerName: "Updated At",
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
        // {
        //     field: "categories",
        //     sortable: true,
        //     headerName: "Category",
        //     width: 160,
        // },
        {
            field: "price",
            headerName: "Price",
            headerClassName: "theme-header",
            type: "number",
            sortable: true,
            sortComparator: (v1, v2) => {
                if (v1.title === "Free") return -1;
                return v1 - v2;
            },
            width: 140,
            renderCell: (params) => {
                return params.value === 0
                    ? "Free"
                    : `${params.value.toLocaleString("vi-VN")} VND`;
            },
        },
        {
            field: "actions",
            headerClassName: "theme-header",
            width: 160,
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
                            <Link to={`/admin/course/detail/${params.value}`}>
                                <img src={viewIcon} alt="" />
                            </Link>
                            <Link to={`/admin/course/edit/${params.value}`}>
                                <img src={editIcon} alt="" />
                            </Link>
                            <button
                                onClick={() => openDeleteModal(params.value)}
                            >
                                <img
                                    src={deleteIcon}
                                    alt=""
                                    className="cursor-pointer"
                                />
                            </button>
                        </div>
                    </div>
                );
            },
        },
    ];

    const handleRemoveCourse = () => {
        const fetchApi = async () => {
            toast.promise(dataApi.softDeleteCourse(deleteId, page, selected), {
                loading: "Removing...",
                success: (data) => {
                    setCourses(data.content);
                    setTotalData(data.totalElements);
                    setPage(0);
                    setSelected(selectes[0]);
                    setDeletedModalOpen(false);
                    return "Remove successfully";
                },
                error: (error) => {
                    console.log(error);
                    return error.content;
                },
            });
        };

        fetchApi();
    };

    const handlePageData = async (action) => {
        setPage(action.page);
        setSelected(action.pageSize);
    };

    const handleCloseModal = () => {
        setDeletedModalOpen(false);
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setDeletedModalOpen(true);
    };

    const handleSearchInputChange = (e) => {
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                const result = await dataApi.getCourseByName(
                    e.target.value,
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

    const handleCategoryChange = (e) => {
        if (e === null) return;
        setIsLoadingData(true);
        setCategory(e);
        const fetchApi = async () => {
            try {
                const result = await dataApi.getCoursesByCategory(
                    false,
                    e,
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

        const debounceApi = debounce(fetchApi);
        debounceApi();
    };

    const reformatCategories = (categories) => {
        let temp = categories.map((cate) => ({
            value: cate.id,
            label: cate.name,
        }));
        temp.unshift({ value: "0", label: "All" });
        return temp;
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCourseAdmin(page, selected);
                setCourses(result.content);
                setTotalData(result.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [page, selected]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                let categories = [];
                categories = await dataApi.getAllCategories(false, 0, 99999);
                const result = await dataApi.getAllCourseAdmin(page, selected);
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

                    <div className="formGroup flex flex-col gap-3">
                        <div
                            className={clsx(
                                styles.contentMain,
                                "flex justify-between gap-3"
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
