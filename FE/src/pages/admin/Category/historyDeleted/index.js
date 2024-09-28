import { useEffect, useRef, useState } from "react";
import styles from "../../Course/list/List.module.scss";
import clsx from "clsx";
import { toast } from "sonner";
import * as dataApi from "../../../../api/apiService/dataService";
import restoreIcon from "../../../../assets/images/restore.svg";
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

function HistoryDeletedCategory() {
    const [categories, setCategories] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selected, setSelected] = useState(selectes[0]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [page, setPage] = useState(0);
    const [render, setRender] = useState();
    const [searchName, setSearchName] = useState();
    const firstRender = useRef(true);

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
                const result = dataApi.getCategoryByTitle(
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
        toast.promise(dataApi.restoreCategoryById(id), {
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
                const result = await dataApi.getAllCategories(
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
                                "flex justify-between"
                            )}
                        >
                            <div className={clsx(styles.contentItem)}></div>
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
        </div>
    );
}

export default HistoryDeletedCategory;
