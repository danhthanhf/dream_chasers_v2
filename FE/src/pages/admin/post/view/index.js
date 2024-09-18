import clsx from "clsx";
import avatar from "../../../../assets/images/avatar_25.jpg";
import * as DataApi from "../../../../api/apiService/dataService";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import moment from "moment";
import { toast } from "sonner";
import * as UserApi from "../../../../api/apiService/authService";
import { useSelector } from "react-redux";

const AdminViewPost = () => {
    const { title } = useParams();
    const [post, setPost] = useState({});
    const [setOpenComment] = useState(false);
    const [setDeletedModalOpen] = useState(false);
    const timeElapsed = moment(post?.createAt).fromNow();
    const user = useSelector((state) => state.login.user);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const watch = searchParams.get("watch");

    useEffect(() => {
        if (!title) return;
        const fetchApi = async () => {
            try {
                console.log(title);
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

    const handleSavePost = async () => {
        console.log(user.email);
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


    return (
        <div className="px-40 my-10">
            <div className="row">
                <div className="col-lg-2 mr-8 mt-3 max-sm:hidden sm:hidden">
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
                    <h1 className="mb-4 font-bold text-3xl"> {post.title}</h1>
                    <div className="flex justify-between mb-7">
                        <div className="flex-1 flex">
                            <img
                                className="mr-3 rounded-full w-12 h-1w-12 border"
                                loading="lazy"
                                src={post.avatar || avatar}
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
                        </div>
                    </div>
                    <div
                        className="mt-6"
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
                </div>
            </div>
        </div>
    );
};

export default AdminViewPost;
