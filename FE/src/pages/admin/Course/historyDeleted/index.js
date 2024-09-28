import styles from "../list/List.module.scss";
import clsx from "clsx";
import restoreIcon from "../../../../assets/images/restore.svg";
import { Fragment, useEffect, useState } from "react";
import * as dataApi from "../../../../api/apiService/dataService";
import { toast } from "sonner";

import DataGridComponent from "../../../../component/table";
import SelectComponent from "../../../../component/select/SelectComponent";

const selectes = [5, 10, 25];
const reformatCategories = (categories) => {
    let temp = categories.map((cate) => ({
        value: cate.id,
        label: cate.name,
    }));
    temp.unshift({ value: "0", label: "All" });
    return temp;
};

function reFormatCuorse(data) {
    if (data.length === 0) return [];
    return data.map((item) => {
        const create = new Date(item.createdAt);
        const update = new Date(item.updatedAt);
        return {
            id: item.id,
            course: item,
            price: item.price,
            // categories: item.categories.map((cate) => cate.name).join(", "),
            createdAt: create,
            updatedAt: update,
            actions: item.id,
        };
    });
}

function HistoryDeleted() {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selected, setSelected] = useState(selectes[0]);
    const [isLoadingData, setIsLoadingData] = useState(false);
    const [page, setPage] = useState(0);
    const [category, setCategory] = useState();

    const columns = [
        {
            field: "course",
            headerClassName: "theme-header",
            headerName: "Course",
            width: 300,
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
            headerClassName: "theme-header",
            field: "createdAt",
            headerName: "Create At",
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
            headerClassName: "theme-header",
            headerName: "Updated At",
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
            headerClassName: "theme-header",
            headerName: "Price",
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
                            <button
                                type="button"
                                onClick={() =>
                                    handleRestoreCourse(params.value)
                                }
                            >
                                <img src={restoreIcon} alt="" />
                            </button>
                        </div>
                    </div>
                );
            },
        },
    ];

    const handleCategoryChange = (e) => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getCoursesDeletedByCategory(
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

        const debounceApi = debounce(fetchApi);
        debounceApi();
    };

    const handleRestoreCourse = (id) => {
        toast.promise(dataApi.restoreCourseById(id, page, selected), {
            loading: "loading...",
            success: (data) => {
                setCourses(data.content);
                return "Restore success";
            },
            error: (error) => {
                console.log(error);
                return error.mess;
            },
        });
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

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCourseDeleted(
                    page,
                    selected
                );
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
                const result = await dataApi.getAllCourseDeleted(
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

    const handlePageData = async (action) => {
        const currentTotalData = page * selected + selected;
        if (action === "next" && currentTotalData < totalData) {
            console.log("a");
            setPage((prev) => prev + 1);
        }
        if (action === "previous" && page > 0) {
            setPage((prev) => prev - 1);
        }
    };

    const handleSelectPageSizeChange = (size) => {
        setSelected(size);
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCourse(page, size);
                setCourses(result.content.content);
                setTotalData(result.content.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
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
        </div>
    );
}

export default HistoryDeleted;
