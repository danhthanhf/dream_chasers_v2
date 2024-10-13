import { Button } from "@nextui-org/button";
import clsx from "clsx";
import { useState } from "react";

function Instructor() {
    const [isDeleted, setIsDeleted] = useState(false);
    return (
        <>
            <div className={clsx("bg-[#2d2f31] text-white pt-12 pb-5")}>
                <div className="container">
                    <h1 className={clsx("uppercase font-extrabold")}>
                        instructor dashboard
                    </h1>
                </div>
            </div>
            <div className="container">
                <div className="border-b-[1px] border-b-gray-200 mb-4">
                    {
                        <div className="flex">
                            <Button
                                onClick={() => setIsDeleted(false)}
                                className={clsx(
                                    "bg-white cursor-pointer rounded-none transition-all delay-100 ease-in min-w-52 font-semibold text-base py-3 h-full px-3 text-gray-500",
                                    {
                                        "text-black border-b-black border-b-2":
                                            !isDeleted,
                                    }
                                )}
                            >
                                Published
                            </Button>
                            <Button
                                className={clsx(
                                    "bg-white cursor-pointer rounded-none min-w-52 transition-all delay-100 ease-in font-semibold text-base py-3 h-full px-3 text-gray-500",
                                    {
                                        "text-black border-b-black border-b-2":
                                            isDeleted,
                                    }
                                )}
                            >
                                History Deleted
                            </Button>
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default Instructor;
