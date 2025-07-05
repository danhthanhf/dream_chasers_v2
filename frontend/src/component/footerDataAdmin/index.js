import {
    CheckIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import styles from "./FooterDataAdmin.module.scss";
import clsx from "clsx";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const selectes = [5, 10, 25];

function FooterDataAdmin({
    handleSelectPageSizeChange,
    totalData,
    size = 5,
    page = 0,
    setPage,
}) {
    const handlePageData = async (action) => {
        const currentTotalData = page * size + size;
        if (action === "next" && currentTotalData < totalData) {
            setPage((page) => page + 1);
        }
        if (action === "previous" && page > 0) {
            setPage((page) => page - 1);
        }
    };

    return (
        <div className={clsx(styles.footer)}>
            <div className={styles.footerItem}>
                Rows per page:
                <div className="b-shadow-light rounded-lg ml-2 w-24">
                    <Listbox value={size} onChange={handleSelectPageSizeChange}>
                        <div className="relative mt-1">
                            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                                <span className="block truncate">{size}</span>
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
                                    {selectes.map((element, index) => (
                                        <Listbox.Option
                                            key={index}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active
                                                        ? "bg-amber-100 text-amber-900"
                                                        : "text-gray-900"
                                                }`
                                            }
                                            value={element}
                                        >
                                            {({ size }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            size
                                                                ? "font-medium"
                                                                : "font-normal"
                                                        }`}
                                                    >
                                                        {element}
                                                    </span>
                                                    {size ? (
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
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </div>
            <div className={clsx(styles.footerItem)}>
                <div className="mr-3">
                    {" "}
                    <span id="currentPage">
                        {page * size + 1}-
                        {totalData < page * size + size
                            ? totalData
                            : page * size + size}
                    </span>
                    <span> of </span>
                    <span id="total">{totalData}</span>
                </div>
                <button
                    disabled={page === 0}
                    onClick={() => handlePageData("previous")}
                    className={clsx(styles.controlPage, {
                        [styles.disableControl]: page === 0,
                    })}
                >
                    <ChevronLeftIcon></ChevronLeftIcon>
                </button>
                <button
                    disabled={page * size + size >= totalData}
                    onClick={() => handlePageData("next")}
                    className={clsx(styles.controlPage, {
                        [styles.disableControl]:
                            page * size + size >= totalData,
                    })}
                >
                    <ChevronRightIcon></ChevronRightIcon>
                </button>
            </div>
        </div>
    );
}

export default FooterDataAdmin;
