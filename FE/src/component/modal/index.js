import { CheckboxGroup, Checkbox } from "@nextui-org/checkbox";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import clsx from "clsx";
import Input from "../InputComponent";

function Modal({
    isOpen,
    closeModal,
    handleRemove,
    
    title = "Delete",
    description,
    isReject = false,
    children,
}) {
    const [detail, setDetail] = useState("");
    if (!isOpen) return null;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-30" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto overlay">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="z-50 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <h2 className={"text-base font-bold uppercase"}>
                                    {title}
                                </h2>
                                <div className={clsx("text-sm my-3")}>
                                    {!isReject && description}
                                    {children}

                                    {isReject && (
                                        <div className="mt-4">
                                            <Input
                                                size="lg"
                                                value={detail}
                                                onHandleChange={(e) =>
                                                    setDetail(e.target.value)
                                                }
                                                label="Detail"
                                            ></Input>
                                        </div>
                                    )}
                                </div>
                                <div className={clsx("flex justify-end gap-2")}>
                                    <button
                                        onClick={() => {
                                            if (isReject) {
                                                handleRemove(
                                                    "REJECTED",
                                                    detail
                                                );
                                                setDetail("");
                                            } else handleRemove();
                                        }}
                                        className={
                                            "py-1.5 px-2 text-xs font-bold rounded-lg text-white border bg-[#ff5630] border-gray-300 uppercase"
                                        }
                                    >
                                        {title}
                                    </button>
                                    <button
                                        onClick={closeModal}
                                        className={
                                            "py-1.5 px-2 rounded-lg text-xs text-black font-bold uppercase border border-gray-600"
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
export default Modal;
