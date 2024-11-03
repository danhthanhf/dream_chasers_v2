import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { motion } from "framer-motion";

const useOutsideClick = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, callback]);
};

function SelectComponent({
    title = "Select",
    data,
    value = [],
    handleChange = () => {},
    maxValues = 3,
}) {
    const [isShowSelect, setIsShowSelect] = useState(false);
    const id = useId();
    const [listSelected, setListSelected] = useState([...value]);
    const [listDataToShow, setLstDataToShow] = useState([...data]);
    const selectRef = useRef(null);
    useEffect(() => {
        setLstDataToShow(data);
        setListSelected(value);
    }, [data, value]);

    const handleAdd = (
        data = {
            label: "",
            value: "",
        }
    ) => {
        let newList = [];
        if (listSelected.length === 0) {
            newList = [data];
        }
        const index = listSelected.findIndex(
            (item) => item.value === data.value
        );
        if (index !== -1) {
            newList = listSelected.filter((item) => item.value !== data.value);
        } else {
            if (listSelected.length >= maxValues) return;
            newList = [...listSelected, data];
        }
        handleChange([...newList]);
        setListSelected([...newList]);
    };
    useEffect(() => {
        handleChange(listSelected);
    }, [listSelected.length]);

    const handleRemove = (
        data = {
            label: "",
            value: "",
        }
    ) => {
        setListSelected((prev) => {
            return prev.filter((item) => item.value !== data.value);
        });
    };

    const isSelectedItem = (e) => {
        return value.findIndex((item) => item.value === e) !== -1;
    };

    const handleSerach = (e) => {
        if (e == "") setListSelected([...data]);
        const value = e.target.value;
        setLstDataToShow([
            ...data.filter((item) =>
                item.label?.toLowerCase().includes(value?.toLowerCase())
            ),
        ]);
    };

    const handleKeyDown = (e) => {
        const value = e.target.value.trim();
        if (value == "") return;
        if (e.key === "Enter") {
            let index = listSelected.findIndex((item) => item.label === value);
            if (index === -1) {
                e.target.value = "";
                setListSelected([
                    ...listSelected,
                    { label: value, value: listSelected.length },
                ]);
            }
        }
    };
    useOutsideClick(selectRef, () => {
        setIsShowSelect(false);
    });
    return (
        <div
            className={
                "relative rounded-lg items-center border-1 transition-all ease-linear focus-within:border-black border-gray-300 hover:border-black"
            }
        >
            <div>
                <label
                    className="text-sm z-20 absolute -top-2 left-2 px-1 font-bold bg-white"
                    htmlFor={id}
                >
                    {title}
                </label>
                <div className="w-full relative flex items-center">
                    <div className="flex gap-2 p-[9px] items-center flex-1 flex-wrap">
                        {value &&
                            value.length > 0 &&
                            value.map((item, index) => (
                                <div
                                    key={item.value + index}
                                    className="cursor-pointer hover:opacity-100 opacity-90 transition-all delay-50 ease-linear flex text-[13px] font-bold bg-[#d6f4f9] rounded-lg p-1 text-[#006C9C]"
                                >
                                    <span className="px-1.5">{item.label}</span>
                                    <svg
                                        onClick={() => handleRemove(item)}
                                        className="w-4 h-4 cursor-pointer hover:opacity-100 opacity-70"
                                        focusable="false"
                                        aria-hidden="true"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            fillRule="evenodd"
                                            d="M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10M8.97 8.97a.75.75 0 0 1 1.06 0L12 10.94l1.97-1.97a.75.75 0 0 1 1.06 1.06L13.06 12l1.97 1.97a.75.75 0 0 1-1.06 1.06L12 13.06l-1.97 1.97a.75.75 0 0 1-1.06-1.06L10.94 12l-1.97-1.97a.75.75 0 0 1 0-1.06"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </div>
                            ))}

                        <input
                            id={id}
                            placeholder="+ Tags"
                            onKeyDown={handleKeyDown}
                            onChange={handleSerach}
                            onClick={() =>
                                setIsShowSelect((showSelect) => !showSelect)
                            }
                            className={
                                "outline-none bg-white py-[7.5px] min-w-14 rounded-lg text-sm flex-1 relative"
                            }
                            type="text"
                        />
                    </div>
                    {listSelected.length > 0 && (
                        <button
                            className="rounded-full hover:bg-gray-200 hover:opacity-80 p-1 mr-2"
                            type="button"
                            aria-label="Clear"
                            title="Clear"
                            onClick={() => setListSelected([])}
                        >
                            <svg
                                className="w-4 h-4"
                                focusable="false"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                                data-testid="CloseIcon"
                            >
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                            </svg>
                        </button>
                    )}
                    <motion.div
                        animate={{
                            opacity: isShowSelect ? 1 : 0.4,
                            scale: isShowSelect ? 1 : 0.5,
                        }}
                        ref={selectRef}
                        className={clsx(
                            "absolute bg-custom z-10  max-h-[232px] top-[103%] w-full px-1 py-2 shadow-lg overflow-y-auto rounded-lg",
                            { block: isShowSelect, hidden: !isShowSelect }
                        )}
                    >
                        {listDataToShow && listDataToShow.length > 0 ? (
                            listDataToShow.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleAdd(item)}
                                    className={clsx(
                                        "text-sm text-gray-600 font-semibold p-2 my-1 hover:bg-gray-200 hover:opacity-75  ease-in cursor-pointer rounded-lg",
                                        {
                                            "bg-gray-200": isSelectedItem(
                                                item.value
                                            ),
                                        }
                                    )}
                                >
                                    {item.label}
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center text-base font-semibold text-gray-500">
                                No data
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default SelectComponent;
