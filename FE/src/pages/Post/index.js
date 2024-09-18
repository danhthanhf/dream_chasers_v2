import { Link } from "react-router-dom";
import styles from "./Post.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import * as dataApi from "../../api/apiService/dataService";
import avatar from "../../assets/images/avatar_25.jpg";
import moment from "moment/moment";
import { Pagination, PaginationItemType } from "@nextui-org/pagination";

const renderItem = ({
    ref,
    key,
    value,
    isActive,
    onNext,
    onPrevious,
    setPage,
    className,
}) => {
    if (value === PaginationItemType.NEXT) {
        return (
            <button
                key={key}
                className={clsx(className, "bg-black min-w-8 w-8 h-8")}
                onClick={onNext}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 rotate-180"
                >
                    <path
                        fillRule="evenodd"
                        d="M7.72 12.53a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 1 1 1.06 1.06L9.31 12l6.97 6.97a.75.75 0 1 1-1.06 1.06l-7.5-7.5Z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        );
    }

    if (value === PaginationItemType.PREV) {
        return (
            <button
                key={key}
                className={clsx(className, "bg-black min-w-8 w-8 h-8")}
                onClick={onPrevious}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5 rotate-180"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        );
    }

    if (value === PaginationItemType.DOTS) {
        return (
            <button key={key} className={className}>
                ...
            </button>
        );
    }

    return (
        <button
            key={key}
            ref={ref}
            className={clsx(
                className,
                isActive &&
                    "text-white bg-gradient-to-br from-black to-black font-bold"
            )}
            onClick={() => setPage(value)}
        >
            {value}
        </button>
    );
};

const PostItem = ({ post, ...props }) => {
    const timeElapsed = moment(post.createAt).fromNow();
    return (
        <div className="boxShadow my-4 rounded-lg border-solid border border-gray-400">
            <div className={clsx("px-3 py-3")}>
                <div className={clsx("flex justify-between")}>
                    <div className="flex">
                        <img
                            loading="lazy"
                            className="mr-3 w-9 h-9 rounded-full"
                            src={avatar}
                            alt="Avatar"
                        />
                        <span className="text-sm font-semibold self-center">
                            {post.userName}
                        </span>
                    </div>
                </div>
                <div className="flex max-sm:flex-col-reverse ">
                    <div className="pr-4 flex-1">
                        <div className={clsx("mt-2.5 flex justify-between ")}>
                            <div>
                                <Link
                                    to={`/posts/${post.title}`}
                                    className="max-sm:text-sm sm:text-sm cursor-pointer py-1 font-bold lg:text-lg md:text-lg line-clamp-3"
                                >
                                    {post.title}
                                </Link>
                                <span
                                    className={clsx(
                                        "sm:text-xs pointer-events-none text-sm mt-2 font-light line-clamp-2 max-sm:text-xs",
                                        styles.innerHtmlContent
                                    )}
                                    dangerouslySetInnerHTML={{
                                        __html: post.content,
                                    }}
                                ></span>
                            </div>
                        </div>
                        <div className={clsx("pt-2.5")}>
                            <div
                                className={clsx(
                                    styles.sub,
                                    "text-xs flex items-center gap-2 "
                                )}
                            >
                                {post.tags?.slice(0, 1).map((tag, index) => {
                                    return (
                                        <span
                                            key={index}
                                            className="bg-gray-200 max-sm:text-xs max-sm:px-1 rounded-md px-2 py-1 font-medium "
                                        >
                                            {tag.name}
                                        </span>
                                    );
                                })}
                                <span className="ml-2 font-medium max-sm:text-xs text-sm">
                                    {timeElapsed}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="max-h-32 w-52 sm:w-20 ">
                        <img
                            loading="lazy"
                            className="w-full lg:h-full xl:h-full block rounded-lg object-cover max-sm:w-full max-sm:h-20 max-sm:mt-3"
                            src={post.thumbnail}
                            alt="post thumbnail"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

function Post({ hideDesc = false }) {
    const [pagination, setPagination] = useState({
        totalPage: 0,
        currentPage: 0,
        size: 1,
    });
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getPosts(
                    pagination.currentPage,
                    pagination.size
                );
                setPagination({
                    ...pagination,
                    totalPage: result.content.totalPage,
                });
                setPosts(result.content.posts);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [pagination.currentPage]);
    return (
        <div className="flex flex-wrap gap-4 mx-auto max-w-screen-xl text-start mt-10">
            <div className="container">
                <div className="flex justify-between items-center">
                    <h1 className={clsx("font-bold text-3xl max-sm:text-lg")}>
                        Featured Article
                    </h1>
                </div>
                <span
                    className={clsx("max-sm:text-sm", { disabled: hideDesc })}
                >
                    Collection of articles sharing experiences of self-learning
                    online programming and web programming techniques ...
                </span>
                <div className="wrap">
                    <div className={clsx("mt-8")}>
                        {posts?.map((post, index) => {
                            return (
                                <PostItem
                                    key={index}
                                    post={post}
                                    index={index}
                                ></PostItem>
                            );
                        })}
                    </div>
                </div>
                <Link
                    to={"/new-post"}
                    style={{ "--clr": "#7808d0" }}
                    className={clsx(
                        styles.button,
                        "max-sm:w-36 max-sm:text-xs max-sm:px-2 max-sm:py-2 justify-center lg:pl-5 max-sm:right-[74px] sm:right-[74px] right-[30px] px-4 py-2 text-base bottom-10 md:right-8 md:bottom-12"
                    )}
                    href="#"
                >
                    <span className={clsx(styles.button__iconWrapper)}>
                        <svg
                            width="10"
                            className={clsx(styles.button__iconSvg)}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 15"
                        >
                            <path
                                fill="currentColor"
                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                            ></path>
                        </svg>

                        <svg
                            className={clsx(
                                styles.button__iconSvg,
                                styles.button__iconSvgCopy
                            )}
                            xmlns="http://www.w3.org/2000/svg"
                            width="10"
                            fill="none"
                            viewBox="0 0 14 15"
                        >
                            <path
                                fill="currentColor"
                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                            ></path>
                        </svg>
                    </span>
                    Create Post
                </Link>
            </div>
            <div className="flex justify-center w-full">
                <Pagination
                    disableCursorAnimation
                    showControls
                    total={pagination.totalPage}
                    initialPage={1}
                    className="gap-2 overflow-hidden max-sm:text-sm"
                    radius="full"
                    onChange={(page) =>
                        setPagination({ ...pagination, currentPage: page - 1 })
                    }
                    renderItem={renderItem}
                    variant="light"
                />
            </div>
        </div>
    );
}

export default Post;
