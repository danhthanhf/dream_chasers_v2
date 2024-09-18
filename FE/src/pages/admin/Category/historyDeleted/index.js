import { useEffect, useRef, useState } from "react";
import styles from "../../Course/list/List.module.scss";
import clsx from "clsx";
import { toast } from "sonner";
import * as dataApi from "../../../../api/apiService/dataService";
import noDataIcon from "../../../../assets/images/ic_noData.svg";
import restoreIcon from "../../../../assets/images/restore.svg";
import Modal from "../../../../component/modal";
import FooterDataAdmin from "../../../../component/footerDataAdmin";

const selectes = [5, 10, 25];

function HistoryDeletedCategory() {
    const [categories, setCategories] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [render, setRender] = useState();
    const firstRender = useRef(true);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCategoryDeleted(
                    page,
                    selected
                );
                console.log(result);
                setCategories(result.content.content);
                setTotalData(result.content.totalElements);
            } catch (error) {
                console.log(error.mess);
            }
        };
        fetchApi();
    }, [render]);

    const handleSelectPageSizeChange = (size) => {
        setSelected(size);
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCategoryDeleted(page, size);
                setCategories(result.content.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleSearchInputChange = (e) => {
        const fetchApi = () => {
            toast.promise(
                dataApi.getCategoryByTitle(e.target.value, page, selected),
                {
                    loading: "loading...",
                    success: (data) => {
                        setCategories(data.content);
                        return "Get data successfully";
                    },
                    error: (error) => {
                        console.log(error);
                        return error;
                    },
                }
            );
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
            success: (data) => {
                setRender(!render);
                return data.mess;
            },
            error: (error) => {
                console.log(error);
                return error.mess;
            },
        });
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCategoryDeleted(
                    page,
                    selected
                );
                console.log(result);
                setCategories(result.content.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [page]);

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
                                        placeholder="Search.."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={clsx(styles.mid)}>
                            <div
                                className={clsx(
                                    styles.titleMid,
                                    "row rounded-lg"
                                )}
                            >
                                <div className="col-lg-2">Id</div>
                                <div className="col-lg-5">Category</div>
                                <div className="col-lg-3">Create at</div>
                                <div className="col-lg-2">Action</div>
                            </div>
                            <div className={clsx(styles.containerData)}>
                                {categories &&
                                    categories.map((category, index) => {
                                        const dateTime = new Date(
                                            category.date
                                        );

                                        const date =
                                            dateTime.toLocaleDateString(); // Lấy ngày tháng năm
                                        const time =
                                            dateTime.toLocaleTimeString();

                                        return (
                                            <div
                                                key={index}
                                                className={clsx(
                                                    styles.item,
                                                    "row rounded-lg"
                                                )}
                                            >
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
                                                        {category.id}
                                                    </div>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-5 flex "
                                                    )}
                                                >
                                                    <div className="overflow-hidden">
                                                        <div
                                                            className={clsx(
                                                                styles.name
                                                            )}
                                                        >
                                                            {category.name}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.field,
                                                        "col-lg-3"
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
                                                        "col-lg-2"
                                                    )}
                                                >
                                                    <div
                                                        className={clsx(
                                                            styles.name,
                                                            "flex gap-4"
                                                        )}
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleRestoreCategory(
                                                                    category.id
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    restoreIcon
                                                                }
                                                                alt=""
                                                            />
                                                        </button>

                                                        {/* <button
                                                            data-micromodal-trigger="modal-1"
                                                            type="button"
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    category.id
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={deleteIcon}
                                                                alt=""
                                                                className="cursor-pointer"
                                                            />
                                                        </button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                {!categories.length && (
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
                                )}
                            </div>
                            <FooterDataAdmin
                                handleSelectPageSizeChange={
                                    handleSelectPageSizeChange
                                }
                                totalData={totalData}
                                size={selected}
                                page={page}
                                setPage={setPage}
                            ></FooterDataAdmin>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryDeletedCategory;
