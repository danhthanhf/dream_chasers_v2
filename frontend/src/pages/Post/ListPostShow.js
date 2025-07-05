import { Link } from "react-router-dom";
import styles from "./Post.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import * as publicService from "../../api/apiService/publicService";

import ListPost from "../../component/ListPostItem";
import PaginationItem from "../../component/Pagination";

function Post() {
    const [pagination, setPagination] = useState({
        totalPage: 0,
        page: 0,
        size: 8,
    });
    const [posts, setPosts] = useState([]);

    const handleChangePagination = (e, value) => {
        setPagination((prev) => {
            return {
                ...prev,
                page: value - 1,
            };
        });
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await publicService.getPosts(
                    pagination.page,
                    pagination.size
                );
                setPagination({
                    ...pagination,
                    totalPage: result.totalPage,
                });
                setPosts(result.posts);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [pagination.page, pagination.size]);

    return (
        <div className="flex flex-wrap gap-4 mx-auto max-w-screen-xl text-start py-10">
            <div className="container">
                <div className="flex justify-between items-center">
                    <h1 className={clsx("font-bold text-3xl max-sm:text-lg")}>
                        Featured Article
                    </h1>
                </div>
                <span className={clsx("max-sm:text-sm")}>
                    Collection of articles sharing experiences of self-learning
                    online programming and web programming techniques ...
                </span>
                <div className="wrap">
                    <div className={clsx("mt-8")}>
                        {posts && posts.length > 0 && (
                            <ListPost cols={4} data={posts} />
                        )}
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
            {pagination.totalPage > 1 && (
                <PaginationItem
                    count={pagination.totalPage}
                    handleChange={handleChangePagination}
                ></PaginationItem>
            )}
        </div>
    );
}

export default Post;
