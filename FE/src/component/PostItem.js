import clsx from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";
import Ink from "react-ink";
import { Link } from "react-router-dom";
import viewIcon from "../assets/images/view.svg";
import editIcon from "../assets/images/edit.svg";
import deleteIcon from "../assets/images/delete.svg";
import { Menu, Transition } from "@headlessui/react";

function PostItem({ post, authorView = false }) {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const [postSelected, setPostSelected] = useState(null);

    const date = new Date(post.createdAt).toLocaleDateString();
    const menuRef = useRef(null);

    function formatNumber(num) {
        if (num >= 1000) {
            return (num / 1000).toFixed(2) + "k";
        }
        return num.toString();
    }

    const handleClick = () => {
        window.scrollTo(0, 0);
    };

    const positionMenu = (event) => {
        const buttonRect = event.currentTarget.getBoundingClientRect();
        setMenuPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.right + window.scrollX - 54,
        });
    };

    const handleMenuButtonClick = (event, post) => {
        event.stopPropagation();
        setIsOpenModal((prev) => !prev);
        setPostSelected(post);
        positionMenu(event);
    };

    const handleClickOutside = (event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            !event.target.closest(".menu-button")
        ) {
            setIsOpenModal(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <div className="rounded-2xl shadow-md w-full">
            <div className="-mb-6 overflow-hidden rounded-t-2xl">
                <img loading="lazy" src={post && post.thumbnail} alt="" />
            </div>
            <div>
                <div className="flex gap-3 mb-3 relative">
                    <svg
                        fill="none"
                        viewBox="0 0 144 62"
                        className="w-[88px] h-9 text-white absolute top-[3px]"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="m111.34 23.88c-10.62-10.46-18.5-23.88-38.74-23.88h-1.2c-20.24 0-28.12 13.42-38.74 23.88-7.72 9.64-19.44 11.74-32.66 12.12v26h144v-26c-13.22-.38-24.94-2.48-32.66-12.12z"
                            fill="currentColor"
                            fillRule="evenodd"
                        ></path>
                    </svg>
                    <div className="z-[2] mt-1.5 px-6">
                        <img
                            src={
                                post?.userAvatar ||
                                "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-16.webp"
                            }
                            alt=""
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="font-bold text-sm flex gap-2 items-center mt-2">
                            <div className="">{post && post.userName}</div>
                            <span className="px-1">-</span>
                            <div className="text-gray-500 font-medium text-[13px]">
                                {post && date}
                            </div>
                        </div>
                    </div>
                </div>

                <Link
                    to={`/posts/${decodeURIComponent(post.title)}`}
                    onClick={handleClick}
                    className="px-6 text-sm text-black hover:underline cursor-pointer font-semibold line-clamp-2"
                >
                    {post && post.title}
                </Link>
                <div
                    className={clsx(
                        "py-6 flex text-xs text-gray-500 gap-2 items-center",
                        {
                            "justify-end  px-6": !authorView,
                            "justify-around  px-2": authorView,
                        }
                    )}
                >
                    {authorView && (
                        <div className="flex gap-1 items-center">
                            <div
                                className="py-1 relative px-1 justify-center itesm-center  rounded-full focus:outline-none cursor-pointer hover:bg-gray-300 hover:opacity-80 transition-all delay-50 ease-in menu-button"
                                onClick={(e) => handleMenuButtonClick(e, post)}
                            >
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
                            <div
                                className={clsx({
                                    tagApproved: post.status === "APPROVED",
                                    tagPending: post.status === "PENDING",
                                    tagDraft: post.status === "DRAFT",
                                    tagRejected: post.status === "REJECTED",
                                })}
                            >
                                {post.status}
                            </div>
                        </div>
                    )}
                    <div className={clsx("flex gap-3")}>
                        <div className="flex gap-1.5 items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                role="img"
                                className="w-[20px] h-[20px]"
                                viewBox="0 0 24 24"
                                width={"1em"}
                            >
                                <path
                                    fill="#919eab"
                                    d="M9.75 12a2.25 2.25 0 1 1 4.5 0a2.25 2.25 0 0 1-4.5 0"
                                ></path>
                                <path
                                    fill="#919eab"
                                    fillRule="evenodd"
                                    d="M2 12c0 1.64.425 2.191 1.275 3.296C4.972 17.5 7.818 20 12 20s7.028-2.5 8.725-4.704C21.575 14.192 22 13.639 22 12c0-1.64-.425-2.191-1.275-3.296C19.028 6.5 16.182 4 12 4S4.972 6.5 3.275 8.704C2.425 9.81 2 10.361 2 12m10-3.75a3.75 3.75 0 1 0 0 7.5a3.75 3.75 0 0 0 0-7.5"
                                    clipRule="evenodd"
                                ></path>
                            </svg>{" "}
                            {post.views && formatNumber(post.views)}
                        </div>

                        <div className="flex gap-1.5 items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[17px] h-[17px]"
                                aria-hidden="true"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#919eab"
                                    d="M19.07 4.93a10 10 0 0 0-16.28 11a1.06 1.06 0 0 1 .09.64L2 20.8a1 1 0 0 0 .27.91A1 1 0 0 0 3 22h.2l4.28-.86a1.26 1.26 0 0 1 .64.09a10 10 0 0 0 11-16.28ZM8 13a1 1 0 1 1 1-1a1 1 0 0 1-1 1m4 0a1 1 0 1 1 1-1a1 1 0 0 1-1 1m4 0a1 1 0 1 1 1-1a1 1 0 0 1-1 1"
                                ></path>
                            </svg>
                            {post.totalComment &&
                                formatNumber(post.totalComment)}
                        </div>

                        <div className="flex gap-1.5 items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[20px] h-[20px]"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#919eab"
                                    d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137"
                                ></path>
                            </svg>
                            {post.likes && formatNumber(post.likes)}
                        </div>
                    </div>
                </div>
            </div>
            {isOpenModal && (
                <div
                    ref={menuRef}
                    className="bg-custom absolute z-10 w-40 mt-2 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black/5"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`,
                    }}
                >
                    <div className="px-1 py-1">
                        <Link
                            to={`/posts/${post.title}/view`}
                            onClick={() => {}}
                            className="font-medium relative group flex w-full items-center rounded-md px-2 py-2.5 text-sm hover:opacity-75 hover:bg-gray-200"
                        >
                            <Ink></Ink>
                            <img className="mr-4" src={viewIcon} alt="" />
                            View
                        </Link>
                        <Link
                            to={`/posts/${post.title}/edit`}
                            className="hover:opacity-75 hover:bg-gray-200 font-medium relative group flex w-full items-center rounded-md px-2 py-2.5 text-sm"
                        >
                            <Ink></Ink>
                            <img className="mr-4" src={editIcon} alt="" />
                            Edit
                        </Link>
                        <button
                            onClick={() => {}}
                            className="hover:opacity-75 hover:bg-gray-200 font-medium relative group flex text-red-500 w-full items-center rounded-md px-2 py-2.5 text-sm"
                        >
                            <Ink></Ink>
                            <img className="mr-4" src={deleteIcon} alt="" />
                            Delete
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostItem;
