import { useEffect, useState } from "react";
import styles from "../../Course/list/List.module.scss";
import clsx from "clsx";
import { toast } from "sonner";
import * as dataApi from "../../../../api/apiService/dataService";
import { Link } from "react-router-dom";
import deleteIcon from "../../../../assets/images/delete.svg";
import viewIcon from "../../../../assets/images/view.svg";
import editIcon from "../../../../assets/images/edit.svg";
import noDataIcon from "../../../../assets/images/ic_noData.svg";
import Modal from "../../../../component/modal";

import FooterDataAdmin from "../../../../component/footerDataAdmin";

const selectes = [5, 10, 25];

function ListCategory() {
    const [categories, setCategories] = useState([]);
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [totalData, setTotalData] = useState(0);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [render, setRender] = useState();

    const handleRemoveCategory = () => {
        const fetchApi = async () => {
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

        fetchApi();
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCategories(page, selected);
                setTotalData(result.content.totalElements);
                setCategories(result.content.content);
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
                const result = await dataApi.getAllCategories(page, size);
                setCategories(result.content.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleSearchInputChange = (e) => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getCategoryByTitle(
                    e.target.value,
                    page,
                    selected
                );
                setCategories(result.content.content);
                setTotalData(result.content.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        const debounceApi = debounce(fetchApi, 300);
        debounceApi();
    };

    const handlePageData = async (action) => {
        const currentTotalData = page * selected + selected;
        if (action === "next" && currentTotalData < totalData) {
            setPage((prev) => prev + 1);
        }
        if (action === "previous" && page > 0) {
            setPage((prev) => prev - 1);
        }
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
        const fetchApi = async () => {
            try {
                const result = await dataApi.getAllCategories(page, selected);
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
                                    {/* <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                        role="img"
                                        className="component-iconify MuiBox-root css-1kj4kj3 iconify iconify--eva"
                                        width="1em"
                                        height="1em"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="m20.71 19.29l-3.4-3.39A7.92 7.92 0 0 0 19 11a8 8 0 1 0-8 8a7.92 7.92 0 0 0 4.9-1.69l3.39 3.4a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42M5 11a6 6 0 1 1 6 6a6 6 0 0 1-6-6"
                                        ></path>
                                    </svg> */}
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
                                                        <Link
                                                            to={`/admin/category/detail/${category.id}`}
                                                        >
                                                            <img
                                                                src={viewIcon}
                                                                alt=""
                                                            />
                                                        </Link>
                                                        <Link
                                                            to={`/admin/category/edit/${category.id}`}
                                                        >
                                                            <img
                                                                src={editIcon}
                                                                alt=""
                                                            />
                                                        </Link>
                                                        <button
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
                                                        </button>
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
