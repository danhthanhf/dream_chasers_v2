import clsx from "clsx";
import styles from "../../Course/list/List.module.scss";
import { Fragment, useEffect, useState } from "react";
import noDataIcon from "../../../../assets/images/ic_noData.svg";
import { Listbox, Transition } from "@headlessui/react";
import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import * as dataApi from "../../../../api/apiService/dataService";
import Modal from "../../../../component/modal";
import avatar from "../../../../assets/images/avatar_1.jpg";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment/moment";
import { toast } from "sonner";
import restoreIcon from "../../../../assets/images/restore.svg";

const selectes = [5, 10, 25];
let timerId;

function ListDeleteInvoice() {
    const [invoices, setInvoices] = useState([]);
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const [totalData, setTotalData] = useState(0);
    const [selectedSize, setSelectedSize] = useState(selectes[0]);
    const [page, setPage] = useState(0);

    const handleSearchInputChange = async (e) => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.searchInvoice(
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
                const result = await dataApi.getAllInvoiceDelete(
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
                const result = await dataApi.getAllInvoiceDelete();
                setInvoices(result.content.content);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, []);

    const [value, setValue] = useState({
        startDate: new Date(),
        endDate: new Date().setMonth(11),
    });

    const handleValueChange = (newValue) => {
        if (newValue.startDate === null && newValue.endDate === null) {
            const fetchApi = async () => {
                try {
                    const result = await dataApi.getAllInvoice();
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
                const result = await dataApi.getInvoicesByDate(
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

    const handleRestoreInvoice = (id) => {
        toast.promise(dataApi.restoreInvoieById(id), {
            loading: "loading...",
            success: (data) => {
                setInvoices(data.content.content);
                console.log(data.content);
                return data.mess;
            },
            error: (error) => {
                console.log(error);
                return error.mess;
            },
        });
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
                                    "flex justify-between"
                                )}
                            >
                                <div
                                    className={clsx(
                                        styles.contentItem,
                                        "flex-auto flex"
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
                                        "flex-auto"
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
                            <div className={clsx(styles.mid)}>
                                <div
                                    className={clsx(
                                        styles.titleMid,
                                        "row rounded-lg"
                                    )}
                                >
                                    <div className="col-lg-1">Id</div>
                                    <div className="col-lg-3">Customer</div>
                                    <div className="col-lg-3">Content</div>
                                    <div className="col-lg-2">Create at</div>
                                    <div className="col-lg-2">Amount</div>
                                    <div className="col-lg-1">Action</div>
                                </div>
                                <div className={clsx(styles.containerData)}>
                                    {invoices &&
                                        invoices.map((invoice, index) => {
                                            const dateTime = new Date(
                                                invoice.date
                                            );
                                            const date =
                                                dateTime.toLocaleDateString();
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
                                                            "col-lg-1"
                                                        )}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                styles.name
                                                            )}
                                                        >
                                                            {invoice.id}
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={clsx(
                                                            styles.field,
                                                            "col-lg-3 flex "
                                                        )}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                styles.cssImg
                                                            )}
                                                        >
                                                            <img
                                                                src={
                                                                    invoice.user
                                                                        .avatar
                                                                        ? invoice
                                                                              .user
                                                                              .avatar
                                                                        : avatar
                                                                }
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <div
                                                                className={clsx(
                                                                    styles.name
                                                                )}
                                                            >
                                                                {invoice.user
                                                                    .firstName +
                                                                    " " +
                                                                    invoice.user
                                                                        .lastName}
                                                            </div>
                                                            <div
                                                                className={clsx(
                                                                    styles.categories
                                                                )}
                                                            >
                                                                {invoice.method}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={clsx(
                                                            styles.field,
                                                            "col-lg-3 flex text-sm"
                                                        )}
                                                    >
                                                        {invoice.content}
                                                    </div>
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
                                                                styles.name
                                                            )}
                                                        >
                                                            {invoice.price === 0
                                                                ? "Free"
                                                                : `${invoice.total.toLocaleString(
                                                                      "vi-VN"
                                                                  )} VND`}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={clsx(
                                                            styles.field,
                                                            "col-lg-1"
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
                                                                    handleRestoreInvoice(
                                                                        invoice.id
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
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {!invoices ||
                                        (!invoices.length && (
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
                                        ))}
                                </div>
                                <div className={clsx(styles.footer)}>
                                    <div className={styles.footerItem}>
                                        Rows per page:
                                        <div className="b-shadow-light rounded-lg ml-2 w-24">
                                            <Listbox
                                                value={selectedSize}
                                                onChange={
                                                    handleSelectPageSizeChange
                                                }
                                            >
                                                <div className="relative mt-1">
                                                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                                        <span className="block truncate">
                                                            {selectedSize}
                                                        </span>
                                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                            <ChevronUpDownIcon
                                                                className="h-5 w-5 text-gray-400"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    </Listbox.Button>
                                                    <Transition
                                                        as={Fragment}
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100"
                                                        leaveTo="opacity-0"
                                                    >
                                                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                                                            {selectes.map(
                                                                (
                                                                    element,
                                                                    index
                                                                ) => (
                                                                    <Listbox.Option
                                                                        className={({
                                                                            active,
                                                                        }) =>
                                                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                                                active
                                                                                    ? "bg-amber-100 text-amber-900"
                                                                                    : "text-gray-900"
                                                                            }`
                                                                        }
                                                                        value={
                                                                            element
                                                                        }
                                                                    >
                                                                        {({
                                                                            selected,
                                                                        }) => (
                                                                            <>
                                                                                <span
                                                                                    className={`block truncate ${
                                                                                        selected
                                                                                            ? "font-medium"
                                                                                            : "font-normal"
                                                                                    }`}
                                                                                >
                                                                                    {
                                                                                        element
                                                                                    }
                                                                                </span>
                                                                                {selected ? (
                                                                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                                                                        <CheckIcon
                                                                                            className="h-5 w-5"
                                                                                            aria-hidden="true"
                                                                                        />
                                                                                    </span>
                                                                                ) : null}
                                                                            </>
                                                                        )}
                                                                    </Listbox.Option>
                                                                )
                                                            )}
                                                        </Listbox.Options>
                                                    </Transition>
                                                </div>
                                            </Listbox>
                                        </div>
                                    </div>
                                    <div className={clsx(styles.footerItem)}>
                                        <div className="mr-3">
                                            <span id="currentPage">
                                                {page * selectedSize + 1}-
                                                {totalData <
                                                page * selectedSize +
                                                    selectedSize
                                                    ? totalData
                                                    : page * selectedSize +
                                                      selectedSize}
                                            </span>
                                            <span> of </span>
                                            <span id="total">{totalData}</span>
                                        </div>
                                        <button
                                            disabled={page === 0}
                                            onClick={() =>
                                                handlePageData("previous")
                                            }
                                            className={clsx(
                                                styles.controlPage,
                                                {
                                                    [styles.disableControl]:
                                                        page === 0,
                                                }
                                            )}
                                        >
                                            <ChevronLeftIcon></ChevronLeftIcon>
                                        </button>
                                        <button
                                            disabled={
                                                page * selectedSize +
                                                    selectedSize >=
                                                totalData
                                            }
                                            onClick={() =>
                                                handlePageData("next")
                                            }
                                            className={clsx(
                                                styles.controlPage,
                                                {
                                                    [styles.disableControl]:
                                                        page * selectedSize +
                                                            selectedSize >=
                                                        totalData,
                                                }
                                            )}
                                        >
                                            <ChevronRightIcon></ChevronRightIcon>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListDeleteInvoice;
