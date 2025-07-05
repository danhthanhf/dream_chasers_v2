import Ink from "react-ink";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

function PopoverComponent({
    buttonText,
    hasBorderBtn = false,
    hasArrow = true,
    children,
    IconJsx,
    classNames,
    x = "50%",
}) {
    const [isOpen, setOpen] = useState(false);
    const popoverRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [popoverRef]);

    return (
        <div
            className={clsx(
                `relative h-full w-full flex items-center shadow-lg`,
                {}
            )}
            ref={popoverRef}
        >
            <button
                className={clsx("center gap-1 text-sm px-1 py-1", {
                    "border borde-white": hasBorderBtn,
                })}
                onClick={() => setOpen(!isOpen)}
            >
                <Ink></Ink>
                {buttonText && <span>{buttonText}</span>}
                {IconJsx && <span>{IconJsx}</span>}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`border border-gray-200 shadow-lg rounded-md bg-white absolute top-full z-10 text-nowrap ${classNames}`}
                        initial={{
                            opacity: 0,
                            scale: 0.7,
                            x: x,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            x: x,
                        }}
                        transition={{
                            duration: 0.3,
                            // delay: 0.5,
                            ease: [0, 0.71, 0.2, 1.01],
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.7,
                        }}
                    >
                        {hasArrow && <div className="arrow-up"></div>}
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default PopoverComponent;
