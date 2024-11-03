import { useEffect, useState } from "react";
import styles from "../../Course/list/List.module.scss";
import clsx from "clsx";
import { toast } from "sonner";
import * as adminService from "../../../../api/apiService/adminService";
import * as publicService from "../../../../api/apiService/publicService";
import restoreIcon from "../../../../assets/images/restore.svg";
import DataGridComponent from "../../../../component/table";
import Modal from "../../../../component/modal";
const selectes = [5, 10, 25];

function reFormat(data) {
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

function HistoryDeletedCategory() {
    const [categories, setCategories] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selectedRow, setSelectedRow] = useState([]);
    const [selected, setSelected] = useState(selectes[0]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [page, setPage] = useState(0);
    const [render, setRender] = useState();
    const [searchName, setSearchName] = useState();
    const [modalContent, setModalContent] = useState({
        title: "RESTORE",
        description: "Are you sure want to restore?",
        handleRemove: () => {},
        isOpen: false,
        handleCloseModal: () => {
            setModalContent({ ...modalContent, isOpen: false });
        },
    });

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
        // {
        //     field: "price",
        //     headerName: "Price",
        //     headerClassName: "theme-header",
        //     type: "number",
        //     sortable: true,
        //     sortComparator: (v1, v2) => {
        //         if (v1.title === "Free") return -1;
        //         return v1 - v2;
        //     },
        //     width: 140,
        //     renderCell: (params) => {
        //         return params.value === 0
        //             ? "Free"
        //             : `${params.value.toLocaleString("vi-VN")} VND`;
        //     },
        // },
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
                        <button
                            type="button"
                            onClick={() => handleRestoreCategory(params.id)}
                        >
                            <img src={restoreIcon} alt="" />
                        </button>
                    </div>
                );
            },
        },
    ];
    const handlePageData = async (action) => {
        setPage(action.page);
        setSelected(action.pageSize);
    };

    const handleSearchInputChange = (e) => {
        setSearchName(e.target.value);
        setIsLoadingData(true);
        const fetchApi = () => {
            try {
                const result = publicService.getCategoryByTitle(
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

        const debounceApi = debounce(fetchApi, 1000);
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

    const handleRestoreCategory = (id) => {
        toast.promise(adminService.restoreCategoryById(id), {
            loading: "loading...",
            success: () => {
                setRender(!render);
                return "Restore Success";
            },
            error: (error) => {
                console.log(error);
                return error.mess;
            },
        });
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await adminService.getAllCategories(
                    true,
                    page,
                    selected
                );
                setCategories(result.content);
                setTotalData(result.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [page, selected, render]);

    const handleRowSelection = (selectionModel) => {
        setSelectedRow(selectionModel);
    };

    const handleRemoveListCategory = async () => {
        toast.promise(adminService.restoreListCategory(selectedRow), {
            loading: "Restoring...",
            success: () => {
                setRender(!render);
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
            handleRemove: handleRemoveListCategory,
            description: `Are you sure want to delete ${selectedRow.length} user?`,
        });
    };

    return (
        <div className="flex justify-center w-full ">
            <div className="container mt-4 mx-14">
                <div className="wrapMainDash">
                    <div className={clsx(styles.topMain)}>
                        <div className={clsx(styles.itemTopMain)}>
                            <h4>HISTORY DELETE</h4>
                        </div>
                        <div className={clsx(styles.itemTopMain)}></div>
                    </div>

                    <div className="formGroup flex flex-col gap-3">
                        <div
                            className={clsx(
                                styles.contentMain,
                                "flex justify-between items-center"
                            )}
                        >
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
                                    className={clsx(styles.search, " mr-4")}
                                >
                                    <input
                                        onChange={handleSearchInputChange}
                                        id="searchInput"
                                        type="search"
                                        value={searchName}
                                        placeholder="Search.."
                                    />
                                </div>
                            </div>
                        </div>
                        <div>
                            <DataGridComponent
                                columns={columns}
                                rows={reFormat(categories)}
                                totalElements={totalData}
                                isLoading={isLoadingData}
                                paginationModel={{
                                    pageSize: selected,
                                    page: page,
                                }}
                                handleRowSelection={handleRowSelection}
                                setPaginationModel={handlePageData}
                            ></DataGridComponent>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={modalContent.isOpen}
                closeModal={modalContent.handleCloseModal}
                title={modalContent.title}
                description={modalContent.description}
                handleRemove={modalContent.handleRemove}
            ></Modal>
        </div>
    );
}

export default HistoryDeletedCategory;
