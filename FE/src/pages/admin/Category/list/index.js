import { useEffect, useState } from "react";
import styles from "../../Course/list/List.module.scss";
import clsx from "clsx";
import { toast } from "sonner";
import * as dataApi from "../../../../api/apiService/dataService";
import { Link } from "react-router-dom";
import deleteIcon from "../../../../assets/images/delete.svg";
import editIcon from "../../../../assets/images/edit.svg";
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
            category: item.name,
            totalCourse: item.totalCourse,
            createdAt: create,
            updatedAt: update,
            actions: item.id,
        };
    });
}

function ListCategory() {
    const [categories, setCategories] = useState([]);
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [totalData, setTotalData] = useState(0);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [render, setRender] = useState();

    const columns = [
        {
            field: "category",
            headerName: "Category",
            headerClassName: "theme-header",
            width: 320,
            type: "string",
            sortable: true,
        },
        {
            field: "totalCourse",
            headerName: "Total Course",
            headerClassName: "theme-header",
            sortable: true,
            type: "number",
            renderCell: (params) => {
                return <div className="text-center">{params.value}</div>;
            },
            width: 176,
        },
        {
            field: "createdAt",
            headerName: "Create At",
            headerClassName: "theme-header",
            sortable: true,
            type: "dateTime",
            width: 200,
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
            width: 200,
            renderCell: (params) => {
                const date = params.value.toLocaleDateString();
                const time = params.value.toLocaleTimeString();
                return <>{date + "" + time}</>;
            },
        },
        {
            field: "actions",
            headerClassName: "theme-header",
            width: 160,
            type: "actions",
            renderCell: (params) => {
                console.log(params);
                return (
                    <div
                        className={clsx(
                            styles.field,
                            "flex items-center h-full"
                        )}
                    >
                        <div className={clsx(styles.name, "flex gap-4")}>
                            <Link to={`/admin/category/edit/${params.value}`}>
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

    const handleRemoveCategory = () => {
        toast.promise(dataApi.softDeleteCategoryById(deleteId), {
            loading: "Removing...",
            success: () => {
                setDeletedModalOpen(false);
                setRender(!render);
                return "Remove successfully";
            },
            error: (error) => {
                return error.content;
            },
        });
    };

    const handleSearchInputChange = (e) => {
        setIsLoadingData(true);

        const fetchApi = async () => {
            try {
                const result = await dataApi.getCategoryByTitle(
                    e.target.value,
                    page,
                    selected
                );
                setCategories(result.content);
                setTotalData(result.totalElements);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoadingData(false);
            }
        };
        const debounceApi = debounce(fetchApi, 300);
        debounceApi();
    };

    const handlePageData = async (action) => {
        setPage(action.page);
        setSelected(action.pageSize);
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

    const handleCloseModal = () => {
        setDeletedModalOpen(false);
    };

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setDeletedModalOpen(true);
    };

    useEffect(() => {
        setIsLoadingData(true);
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCategories(
                    false,
                    page,
                    selected
                );
                setCategories(result.content);
                setTotalData(result.totalElements);
                setIsLoadingData(false);
            } catch (error) {
                setIsLoadingData(false);
                console.log(error);
            }
        };
        fetchApi();
    }, [page, selected, render]);

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
                                to={"/admin/category/create"}
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
                                New Category
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
                            <div className={clsx(styles.contentItem)}></div>
                            <div
                                className={clsx(styles.contentItem, "flex-1 ")}
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
                                rows={reFormatCuorse(categories)}
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
                handleRemove={handleRemoveCategory}
            ></Modal>
        </div>
    );
}

export default ListCategory;
