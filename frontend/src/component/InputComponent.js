import { useId } from "react";
import clsx from "clsx";

function InputComponent({
    label = "Label",
    type = "text",
    placeholder,
    value = "",
    size = "md",
    noLabel = false,
    onFocus = () => {},
    autoFocus = true,
    ref = null,
    classNames = "",
    onHandleChange = () => {},
}) {
    const id = useId();
    return (
        <div
            className={clsx(
                `relative rounded-lg items-center border-1 transition-all ease-linear focus-within:border-black border-gray-300 hover:border-black ${classNames}`
            )}
        >
            <div className="p-[16px]">
                {!noLabel && (
                    <label
                        className="text-xs absolute -top-2 left-2 px-1 font-bold bg-white"
                        htmlFor={id}
                    >
                        {label}
                    </label>
                )}
                {size !== "lg" ? (
                    <input
                        ref={ref}
                        onFocus={onFocus}
                        id={id}
                        value={value}
                        autoFocus={autoFocus}
                        onChange={onHandleChange}
                        placeholder={placeholder}
                        className={clsx("outline-none text-[15px] w-full")}
                        type={type}
                    />
                ) : (
                    <textarea
                        ref={ref}
                        onFocus={onFocus}
                        id={id}
                        onChange={onHandleChange}
                        value={value}
                        autoFocus={autoFocus}
                        placeholder={placeholder}
                        className={clsx(
                            "text-[16px] outline-none text-sm w-full h-[68px]"
                        )}
                        name=""
                    ></textarea>
                )}
            </div>
        </div>
    );
}

export default InputComponent;
