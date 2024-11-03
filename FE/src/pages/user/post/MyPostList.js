import clsx from "clsx";
import { useEffect, useState } from "react";
import Ink from "react-ink";
import Modal from "../../../component/modal";
import PostItem from "../../../component/PostItem";
import * as userService from "../../../api/apiService/userService";
import { toast } from "sonner";
import ListPost from "../../../component/ListPostItem";

function MyPostList({ page = "MY_POST", children }) {
    const [posts, setPosts] = useState([]);
    const [isDeleted, setIsDeleted] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
    });
    const [optionShow, setOptionShow] = useState({
        deleted: false,
        status: "APPROVED",
    });

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await userService.default(
                    optionShow.status,
                    optionShow.deleted,
                    pagination
                );
                setPosts(result.content);
            } catch (error) {
                console.log(error);
                toast.error("Server error");
            }
        };

        fetchApi();
    }, [
        pagination.page,
        optionShow.deleted,
        optionShow.status,
        pagination.size,
        pagination,
    ]);

    return (
        <div>
            <>
                <div className={clsx("bg-[#2d2f31] text-white pt-12 pb-5")}>
                    <div className="container">
                        <h1 className={clsx("uppercase font-extrabold")}>
                            {page === "MY_POST" ? "My Post" : "Bookmark"}
                        </h1>
                    </div>
                </div>
                <div className="container">
                    <div className="border-b-[1px] border-b-gray-200 mb-4">
                        {page === "MY_POST" && (
                            <div className="flex">
                                <div
                                    onClick={() => setIsDeleted(false)}
                                    className={clsx(
                                        "bg-white relative cursor-pointer rounded-none transition-all delay-100 ease-in min-w-52 font-semibold text-base py-3 h-full px-3 text-gray-500",
                                        {
                                            "text-black border-b-black border-b-2":
                                                !isDeleted,
                                        }
                                    )}
                                >
                                    <Ink></Ink>
                                    Published
                                </div>
                                <div
                                    onClick={() => setIsDeleted(true)}
                                    className={clsx(
                                        "bg-white relative cursor-pointer rounded-none min-w-52 transition-all delay-100 ease-in font-semibold text-base py-3 h-full px-3 text-gray-500",
                                        {
                                            "text-black border-b-black border-b-2":
                                                isDeleted,
                                        }
                                    )}
                                >
                                    <Ink></Ink>
                                    History Deleted
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-3">
                        {children}
                        <ListPost authorView={true} data={posts} gap={3}>
                            {" "}
                        </ListPost>
                        {posts?.length === 0 && (
                            <span className="flex justify-center text-lg font-medium">
                                You don't have any post yet
                            </span>
                        )}
                    </div>
                    {/* <Modal
                        isOpen={isOpen}
                        closeModal={closeDeleteModal}
                        title={"Delete"}
                        description={"Are you sure want to delete this post?"}
                        handleRemove={handleRemovePost}
                    ></Modal> */}
                </div>
            </>
        </div>
    );
}

export default MyPostList;
