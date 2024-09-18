import clsx from "clsx";
import avatar from "../../../assets/images/avatar_25.jpg";
import Post from "../index";
import * as DataApi from "../../../api/apiService/dataService";
import { Link, useLocation, useParams } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import CommentInPost from "../../../component/comment/commentInPost";
import { toast } from "sonner";
import * as UserApi from "../../../api/apiService/authService";
import { useSelector } from "react-redux";
import { Menu, Transition } from "@headlessui/react";
import Modal from "../../../component/modal";

export function Dropdown({
    children,
    handleRestorePost,
    handleOpenDeletePost,
    handleRemoveBookmark,
    isMyPost = false,
    post,
}) {
    const handeCopyLink = () => {
        navigator.clipboard
            .writeText(
                `http://localhost:3000/posts/${encodeURIComponent(post.title)}`
            )
            .then(() => {
                toast.success("Copied to clipboard");
            })
            .catch((err) => {
                toast.error("Could not copy text: ", err);
            });
    };

    console.log(post);

    return (
        <div className="text-right flex">
            <Menu as="div" className="relative text-left flex ml-2">
                <Menu.Button className="inline-flex w-full justify-center rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6 cursor-pointer hover:opacity-75 "
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                    </svg>
                </Menu.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        className={clsx(
                            "absolute top-8 w-48 right-0 mt-2origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                        )}
                    >
                        <div className="px-1 py-1">
                            <div>
                                {isMyPost ? (
                                    <>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <Link
                                                    to={`/post/${post.id}/edit`}
                                                    className={`${
                                                        active
                                                            ? "bg-black text-white"
                                                            : "text-gray-900"
                                                    }  font-medium group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                                >
                                                    {active ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="mr-3 w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="mr-3 w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                                            />
                                                        </svg>
                                                    )}
                                                    Edit
                                                </Link>
                                            )}
                                        </Menu.Item>
                                        {!post?.deleted ? (
                                            <>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <div
                                                            onClick={() =>
                                                                handleOpenDeletePost(
                                                                    post.id
                                                                )
                                                            }
                                                            className={`${
                                                                active
                                                                    ? "bg-black text-white"
                                                                    : "text-red-600"
                                                            } cursor-pointer font-medium group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                                        >
                                                            {active ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="mr-3 w-4 h-4 "
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                    />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={
                                                                        1.5
                                                                    }
                                                                    stroke="currentColor"
                                                                    className="mr-3 w-4 h-4 "
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                    />
                                                                </svg>
                                                            )}
                                                            Delete
                                                        </div>
                                                    )}
                                                </Menu.Item>
                                            </>
                                        ) : (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <div
                                                        onClick={() =>
                                                            handleRestorePost(
                                                                post.id
                                                            )
                                                        }
                                                        className={`${
                                                            active
                                                                ? "bg-black text-white"
                                                                : "text-red-600"
                                                        } font-medium group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                                    >
                                                        {active ? (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="currentColor"
                                                                className="mr-3 w-4 h-4 "
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                                                />
                                                            </svg>
                                                        ) : (
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={
                                                                    1.5
                                                                }
                                                                stroke="currentColor"
                                                                className="mr-3 w-4 h-4 "
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
                                                                />
                                                            </svg>
                                                        )}
                                                        Restore
                                                    </div>
                                                )}
                                            </Menu.Item>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={handeCopyLink}
                                                    className={`${
                                                        active
                                                            ? "bg-black text-white"
                                                            : "text-gray-900"
                                                    } font-medium group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                                >
                                                    {active ? (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="mr-4 w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                                                            />
                                                        </svg>
                                                    ) : (
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="mr-4 w-4 h-4"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                                                            />
                                                        </svg>
                                                    )}
                                                    Copy Link
                                                </button>
                                            )}
                                        </Menu.Item>
                                    </>
                                )}
                            </div>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        </div>
    );
}

const ViewPost = () => {
    const { title } = useParams();
    const [post, setPost] = useState({});
    const [openComment, setOpenComment] = useState(false);
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const timeElapsed = moment(post?.createAt).fromNow();
    const user = useSelector((state) => state.login.user);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const watch = searchParams.get("watch");
    useEffect(() => {
        if (!title) return;
        const fetchApi = async () => {
            try {
                const result = await DataApi.getPostByTitle(title);
                setPost(result.content);
            } catch (error) {
                console.log(error);
            }
        };

        fetchApi();
        if (watch === "comment") {
            setOpenComment((prev) => true);
        }
    }, [title]);

    const handleOpenComment = () => {
        setOpenComment(true);
    };

    const handleCloseComment = () => {
        setOpenComment(false);
    };

    const handleSavePost = async () => {
        toast.promise(UserApi.toggleSavePost(post.id, user.email), {
            loading: "loading...",
            success: (result) => {
                setPost({ ...post, isFavorite: !post.isFavorite });
                return result.mess;
            },
            error: (error) => {
                return error.mess;
            },
        });
    };

    const handleCloseModal = () => {
        setDeletedModalOpen(false);
    };

    const handleRemovePost = () => {
        toast.promise(UserApi.deletePost(user.email, post.id), {
            loading: "Loading...",
            success: (result) => {
                toast.success(result.mess);
            },
            error: (error) => {
                return error?.mess;
            },
        });
    };

    const openDeleteModal = () => {
        setDeletedModalOpen(true);
    };

    return (
        <div className="max-sm:px-4 sm:px-4 lg:px-40 mt-10">
            <div className="row">
                <div className="col-lg-2 mr-8 mt-3 lg:block max-sm:hidden sm:hidden">
                    <div className="sticky top-32">
                        <div className="pb-2.5 font-semibold">
                            {post.userName}
                        </div>
                        <hr className="cssHr" />
                        <div className="flex mt-4">
                            <span
                                className="flex items-center opacity-60 cursor-pointer hover:opacity-100"
                                onClick={handleOpenComment}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6 mr-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                                    />
                                </svg>
                                {post.totalComment}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="col-lg-9 col-sm-12">
                    <h1 className="mb-4 font-bold text-3xl max-sm:text-xl sm:text-xl md:text-2xl">
                        {post.title}
                    </h1>
                    <div className="flex justify-between mb-7">
                        <div className="flex-1 flex">
                            <img
                                className="mr-3 rounded-full h-12 w-12 border"
                                loading="lazy"
                                src={post.userAvatar || avatar}
                                alt="User avavtar"
                            />
                            <div className="mt-1">
                                <div className="font-semibold">
                                    {post.userName}
                                </div>
                                <div className="mt-1 font-normal text-sm text-gray-500">
                                    {timeElapsed}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <svg
                                onClick={handleSavePost}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className={clsx(
                                    "w-6 h-6 cursor-pointer hover:opacity-75",
                                    {
                                        "fill-none": !post.isFavorite,
                                        "fill-black": post.isFavorite,
                                    }
                                )}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                />
                            </svg>
                            <Dropdown
                                handleOpenDeletePost={openDeleteModal}
                                post={post}
                                isMyPost={user?.email === post?.email}
                            ></Dropdown>
                        </div>
                    </div>
                    <div
                        className="mt-6 overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    ></div>
                    <div className="flex mb-6 mt-10">
                        <span
                            className="flex items-center cursor-pointer hover:opacity-75 mb-4"
                            onClick={handleOpenComment}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6 mr-1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                                />
                            </svg>
                            Comment
                            {/* {post.totalComment} */}
                        </span>
                    </div>
                    <div
                        className={clsx(
                            "text-sm font-semibold flex items-center "
                        )}
                    >
                        Tags:
                        {post.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="ml-2 bg-gray-200 rounded-sm px-2.5 py-1 font-normal  text-gray-700"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                    <div className="cssHr mt-7" />
                    <Post hideDesc={true}></Post>
                </div>
            </div>
            {openComment && (
                <CommentInPost
                    post={post}
                    openModal={openComment}
                    funcCloseModal={handleCloseComment}
                ></CommentInPost>
            )}
            <Modal
                isOpen={deletedModalOpen}
                closeModal={handleCloseModal}
                title={"Delete"}
                description={"Are you sure want to delete this post?"}
                handleRemove={handleRemovePost}
            ></Modal>
        </div>
    );
};

export default ViewPost;
