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
import DataGridComponent from "../../../../component/table";

const selectes = [5, 10, 25];

function reFormatData(data) {
    return data.map((item) => {
        const create = new Date(item.createdAt);
        const update = new Date(item.updatedAt);
        return {
            id: item.id,
            title: item.title,
            price: item.price,
            categories: item.categories.map((cate) => cate.name).join(", "),
            createdAt: create,
            // updatedAt: update,
            actions: item.id,
        };
    });
}

function ListCourse() {
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const [courses, setCourses] = useState([]);
    const [options, setOptions] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);

    const columns = [
        {
            field: "title",
            headerName: "Course",
            width: 300,
            sortable: true,
        },
        {
            field: "createdAt",
            headerName: "Create At",
            sortable: true,
            type: "dateTime",
            width: 240,
            renderCell: (params) => {
                const date = params.value.toLocaleDateString();
                const time = params.value.toLocaleTimeString();
                return <>{date + "" + time}</>;
            },
        },
        // {
        //     field: "updatedAt",
        //     headerName: "Updated At",
        //     sortable: true,
        //     type: "dateTime",
        //     width: 160,
        // },
        {
            field: "categories",
            sortable: true,
            headerName: "Category",
            width: 160,
        },
        {
            field: "price",
            headerName: "Price",
            sortable: true,
            width: 180,
            renderCell: (params) => {
                return params.value === 0
                    ? "Free"
                    : `${params.value.toLocaleString("vi-VN")} VND`;
            },
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 160,
            sortable: false,
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
            toast.promise(dataApi.softDeleteCourse(deleteId), {
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
                setCourses(result.content);
                setTotalData(result.totalElements);
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
                const result = await dataApi.getAllCourse(false, page, size);
                setCourses((prev) => result.content);
                setTotalData(result.totalElements);
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
                setCourses(result.content);
                setTotalData(result.totalElements);
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
                categories = await dataApi.getAllCategories(false, 0, 99999);
                const result = await dataApi.getAllCourseAdmin(page, selected);
                categories.content.push({ id: "-1", name: "All" });
                setCourses(result.content);
                setTotalData(result.totalElements);
                setOptions(categories.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [page, selected]);

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
                       
                        <div>
                            <DataGridComponent
                                columns={columns}
                                rows={reFormatData(courses)}
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
