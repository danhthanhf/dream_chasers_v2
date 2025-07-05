import clsx from "clsx";
import styles from "../../Course/list/List.module.scss";
import { Fragment, useEffect, useState } from "react";
import deleteIcon from "../../../../assets/images/delete.svg";
import * as adminService from "../../../../api/apiService/adminService";
import Modal from "../../../../component/modal";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment/moment";
import { toast } from "sonner";
import Ink from "react-ink";
import DataGridComponent from "../../../../component/table";

const selectes = [5, 10, 25];
let timerId;

function ListInvoice() {
    const [invoices, setInvoices] = useState([]);
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const [totalData, setTotalData] = useState(0);
    const [deleteId, setDeleteId] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState(selectes[0]);
    const [selected, setSelected] = useState(selectes[0]);
    const [page, setPage] = useState(0);
    const [show, setShow] = useState(false);
    const [invoiceSelected, setInvoiceSelected] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [selectedRow, setSelectedRow] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [value, setValue] = useState({
        startDate: new Date(),
        endDate: new Date().setMonth(11),
    });
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

    const openDeleteModal = (id) => {
        setDeleteId(id);
        setDeletedModalOpen(true);
    };

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
                                    params.value?.categories
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
                            {/* <Link to={`/admin/course/edit/${params.value.id}`}>
                                <img src={editIcon} alt="" />
                            </Link> */}
                            <button
                                onClick={() => {
                                    setModalContent({
                                        ...modalContent,
                                        title: "DELETE",
                                        isOpen: true,
                                        description:
                                            "Are you sure want to delete",
                                        handleRemove: () =>
                                            handleRemove(params.value.id),
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
    const handleRowSelection = (selectionModel) => {
        setSelectedRow(selectionModel);
    };

    const handleMenuButtonClick = (event, invoice) => {
        event.stopPropagation();

        setIsOpen((prev) => !prev);
        setInvoiceSelected(invoice);
        positionMenu(event);
    };

    const positionMenu = (event) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.right + window.scrollX - 160,
        });
    };

    const handleRemoveInvoice = () => {
        const fetchApi = async () => {
            toast.promise(adminService.softDeleteInvoice(deleteId), {
                loading: "Removing...",
                success: (data) => {
                    setInvoices(data.content.content);
                    setTotalData(data.content.totalElements);
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

    const handleSearchInputChange = async (e) => {
        const fetchApi = async () => {
            try {
                const result = await adminService.searchInvoice(
                    e.target.value,
                    page,
                    selectedSize
                );
                setInvoices(result.content.content);
            } catch (error) {
                console.log(error);
            }
        };
        const debounceApi = debounce(fetchApi, 300);
        debounceApi();
    };

    const handleCloseModal = () => {
        setDeletedModalOpen(false);
    };

    const handlePageData = async (action) => {
        const currentTotalData = page * selectedSize + selectedSize;
        let updatePage = page;
        if (action === "next" && currentTotalData < totalData) {
            updatePage += 1;
            setPage(updatePage);
        }
        if (action === "previous" && page > 0) {
            updatePage -= 1;
            setPage(updatePage);
        }
        fetchInvoicesUpdate(updatePage, selectedSize);
    };

    const debounce = (func, delay = 600) => {
        return () => {
            clearTimeout(timerId);
            timerId = setTimeout(() => {
                func();
            }, delay);
        };
    };

    const fetchInvoicesUpdate = async () => {
        const fetchApi = async () => {
            try {
                const result = await adminService.getAllInvoiceByPage(
                    page,
                    selectedSize
                );
                setInvoices((prev) => result.content.content);
                setTotalData(result.content.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleSelectPageSizeChange = (size) => {
        setSelectedSize((prev) => size);
        fetchInvoicesUpdate(page, size);
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await adminService.getAllInvoice();
                setInvoices(result.content.content);
                setTotalData(result.content.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, []);
    const handleChange = (e) => {
        console.log(e);
    };
    const handleClose = () => {
        setShow(true);
    };
    const handleRemove = (id) => {};

    const handleValueChange = (newValue) => {
        if (newValue.startDate === null && newValue.endDate === null) {
            const fetchApi = async () => {
                try {
                    const result = await adminService.getAllInvoice();
                    setInvoices(result.content.content);
                    console.log(result);
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
            return;
        }
        const tempStart = moment(newValue.startDate, "YYYY-MM-DD");
        const tempEnd = moment(newValue.endDate, "YYYY-MM-DD");
        const startDate = tempStart.format("YYYY-MM-DDTHH:mm:ss.SSS");
        const enđDate = tempEnd.format("YYYY-MM-DDTHH:mm:ss.SSS");
        const fetchApi = async () => {
            try {
                const result = await adminService.getInvoicesByDate(
                    startDate,
                    enđDate,
                    page,
                    selectedSize
                );
                setInvoices(result.content.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
        setValue(newValue);
    };

    return (
        <div>
            <div className="flex justify-center w-full ">
                <div className="container mt-4 mx-14">
                    <div className="wrapMainDash">
                        <div className={clsx(styles.topMain)}>
                            <div className={clsx(styles.itemTopMain)}>
                                <h4>List</h4>
                            </div>
                            <div className={clsx(styles.itemTopMain)}></div>
                        </div>

                        <div className="formGroup flex flex-col gap-3">
                            <div
                                className={clsx(
                                    styles.contentMain,
                                    "flex justify-between gap-3"
                                )}
                            >
                                <div
                                    className={clsx(
                                        styles.contentItem,
                                        "w-[240px]"
                                    )}
                                >
                                    <div className={clsx(styles.formSelect)}>
                                        <label htmlFor="">Date</label>
                                        <Datepicker
                                            containerClassName="relative h-full"
                                            inputClassName="h-full border-gray-200 border pl-2 w-full rounded-md focus:ring-0 font-normal"
                                            value={value}
                                            onChange={handleValueChange}
                                        />
                                    </div>
                                </div>
                                <div
                                    className={clsx(
                                        styles.contentItem,
                                        "flex-1"
                                    )}
                                >
                                    <div
                                        id="seachWrap"
                                        className={clsx(styles.search)}
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
                            <DataGridComponent
                                columns={columns}
                                rows={reFormat(invoices)}
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
                <Modal
                    isOpen={deletedModalOpen}
                    closeModal={handleCloseModal}
                    title={"Delete"}
                    description={"Are you sure want to delete?"}
                    handleRemove={handleRemoveInvoice}
                ></Modal>
            </div>
        </div>
    );
}

export default ListInvoice;

function reFormat(data) {
    if (!data || data.length === 0) return [];

    return data.map((item) => {
        const create = new Date(item.createdAt);
        return {
            id: item.id,
            customer: item,
            content: item,
            createdAt: create,
            amount: item,
            actions: item,
        };
    });
}
