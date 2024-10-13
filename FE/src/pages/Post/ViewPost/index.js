import clsx from "clsx";
import * as dataService from "../../../api/apiService/dataService";
import { Link, useLocation, useParams } from "react-router-dom";
import { over } from "stompjs";
import { Fragment, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import InputComponent from "../../../component/InputComponent";
import * as userService from "../../../api/apiService/authService";
import SockJS from "sockjs-client";
import { Menu, Transition } from "@headlessui/react";
import { getTimeElapsed } from "../../../component/Ultil";
import { sessionExpired } from "../../../api/instance";
import PaginationItem from "../../../component/Pagination";
import ListPost from "../../../component/ListPostItem";

const onError = (err) => {
    console.log(err);
};

const showElementToCenter = (e) => {
    e.currentTarget.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
    });
};

function formatDate(date) {
    const options = { year: "numeric", month: "short", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-US", options).replace(",", "");
}

var stompClient = null;

const ViewPost = () => {
    const { title } = useParams();
    const userInfo = useSelector((state) => state.login.user);
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [listViewSubComment, setListViewSubComment] = useState([]);
    const [showReplyBox, setShowReplyBox] = useState({
        id: null,
    });
    const initComment = {
        author: {
            email: userInfo && userInfo.email,
            avatarUrl: userInfo && userInfo.avatarUrl,
            firstName: userInfo && userInfo.firstName,
            lastName: userInfo && userInfo.lastName,
        },
        content: "",
    };
    const [deletedModalOpen, setDeletedModalOpen] = useState(false);
    const user = useSelector((state) => state.login.user);
    const [comment, setComment] = useState(initComment);
    const [subComment, setSubComment] = useState(initComment);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
        totalPage: 1,
    });
    const [recentPosts, setRecentPosts] = useState([]);
    const [listOpenSubComment, setListOpenSubComment] = useState([]);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const watchParam = searchParams.get("watch");
    const containerCommentRef = useRef(null);
    const firstRender = useRef(false);
    const isMounted = useRef(true);

    const handleSavePost = async () => {
        toast.promise(userService.toggleSavePost(post.id, user.email), {
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

    const handleRemovePost = () => {
        toast.promise(userService.deletePost(user.email, post.id), {
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

    function getAllSubComments(commentId, comments, checkedIds = new Set()) {
        if (checkedIds.has(commentId)) {
            return [];
        }
        checkedIds.add(commentId);

        let subComments = comments.filter((c) => c.parentId === commentId);
        let allSubComments = [...subComments];
        subComments.forEach((subComment) => {
            let subSubComments = getAllSubComments(
                subComment.id,
                comments,
                checkedIds
            );
            allSubComments = [...allSubComments, ...subSubComments];
        });
        return allSubComments;
    }

    const handleViewSubComment = (cmt) => {
        setListViewSubComment([...listViewSubComment, cmt.id]);
    };

    const handleReply = (e, cmt, grandParentId, isSub = false) => {
        if (cmt.id === showReplyBox.id) {
            setShowReplyBox({
                id: null,
            });
        } else {
            setSubComment({
                ...subComment,
                repliedUser: {
                    email: cmt.author.email,
                },
                content: "",
                parentId: cmt.id,
            });
            setShowReplyBox({
                id: cmt.id,
                grandParentId: grandParentId,
                userName: cmt.author.firstName + cmt.author.lastName,
                isSub,
            });
        }
        showElementToCenter(e);
    };

    const handleRemoveComment = (cmtId) => {
        const fetchApi = async () => {
            try {
                await userService.removeCommentById(userInfo.email, cmtId);
                const result = await dataService.getComments(
                    `/post/${post.id}?page=${pagination.page}&size=${pagination.size}`
                );
                setComments(result.content.content);
            } catch (error) {
                toast.error(error.mess);
                console.log(error);
            }
        };

        fetchApi();
    };

    const connect = (postId) => {
        const Sock = new SockJS("http://localhost:8080/ws");
        stompClient = over(Sock);
        stompClient.connect(
            {},
            () => {
                stompClient.subscribe(
                    `/comment/post/${postId}`,
                    onMessageReceived
                );
            },
            onError
        );
    };

    const onDisconnected = () => {
        console.log("Disconnect Websocket");
    };

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        if (
            payloadData.status &&
            payloadData.status === "INTERNAL_SERVER_ERROR"
        ) {
            toast.error(payloadData.message);
            return;
        }
        if (payloadData.parentId !== null) {
            setComments((prev) =>
                prev.map((cmt) => {
                    if (cmt.id === payloadData.parentId) {
                        if (cmt.replies) {
                            cmt.replies = [payloadData, ...cmt.replies];
                        } else cmt.replies = [payloadData];
                    }
                    return cmt;
                })
            );
        } else {
            setComments((prev) => [payloadData, ...prev]);
        }
        setPost((prev) => {
            return {
                ...prev,
                totalComment: prev.totalComment + 1,
            };
        });
    };

    const handleSendNewComment = (e, sub = false) => {
        e.preventDefault();
        if (!user) {
            sessionExpired();
            return;
        }
        SendValue(sub);
    };

    const SendValue = (sub) => {
        if (stompClient) {
            let data = {
                postId: post.id,
            };
            sub
                ? (data = {
                      ...data,
                      ...subComment,
                  })
                : (data = {
                      ...data,
                      ...comment,
                  });
            stompClient.send(
                `/app/comment/post/${post.id}`,
                {},
                JSON.stringify(data)
            );
            sub
                ? setSubComment({ ...subComment, content: "" })
                : setComment({ ...comment, content: "" });
        } else {
            console.log("stompClient is not connected");
        }
    };

    const recordView = (postId) => {
        dataService.recordViewForPost(postId);
    };

    const getRencentPost = async () => {
        try {
            const result = await dataService.getPosts(0, 4);

            setRecentPosts(result.posts);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        var timer = null;
        const fetchApi = async () => {
            try {
                const result = await dataService.getPostByTitle(
                    title,
                    watchParam,
                    pagination
                );
                const formatCreatedAt = formatDate(result.content.createdAt);
                setPagination((prev) => {
                    return {
                        ...prev,
                        totalPage: result.content.totalPageComment,
                    };
                });
                setPost({ ...result.content, createdAt: formatCreatedAt });
                setComments(result.content.comments);
                if (!title) return;
                timer = setTimeout(() => {
                    recordView(result.content.id);
                }, 1000);
                connect(result.content.id);
                firstRender.current = true;
            } catch (error) {
                console.log(error);
            }
        };
        if (!firstRender.current || title !== post.title) {
            fetchApi();
            getRencentPost();
        } else {
            connect(post.id);
            getMoreComments();
        }

        return () => {
            clearTimeout(timer);
            if (stompClient && stompClient.connected) {
                stompClient.disconnect(onDisconnected, {});
            }
        };
    }, [title, watchParam, pagination.page]);

    const getMoreComments = async () => {
        try {
            const result = await dataService.getCommentByPostId(
                post.id,
                pagination
            );
            setComments(result);
        } catch (error) {
            console.log(error);
        }
    };

    const handleLike = () => {
        try {
            userService.toggleLikePost(post.id, user.email);
            setPost({
                ...post,
                likes: post.liked ? post.likes - 1 : post.likes + 1,
                liked: !post.liked,
            });
        } catch (error) {
            console.log(error);
            toast.error("Error while like post");
        }
    };

    const handleChangePagination = (e, value) => {
        setPagination((prev) => {
            return {
                ...prev,
                page: value - 1,
            };
        });
    };

    return (
        <>
            <div
                style={{ backgroundImage: `url(${post.thumbnail})` }}
                className="w-full h-[400px] bg-cover bg-center relative flex bg-opacity-70"
            >
                <div className="absolute inset-0 bg-black opacity-70"></div>
                <div className="max-w-[1200px] px-3 mx-auto z-10 flex flex-col justify-between">
                    <h1 className="font-bold text-3xl text-white pt-[64px] max-w-[800px]">
                        {post.title}
                    </h1>
                    <div className="flex gap-3 items-center pb-[64px]">
                        <div>
                            <img
                                className="rounded-full w-16 h-16"
                                src={post.userAvatar ? post.userAvatar : ""}
                                alt="Avatar"
                            />
                        </div>
                        <div>
                            <div className="text-base font-semibold text-white">
                                {post.userName ? post.userName : ""}
                            </div>
                            <div className="text-sm  text-gray-400 font-semibold">
                                {post.createdAt}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex gap-2">
                <div className="mx-auto max-w-[720px] mt-4 flex flex-col gap-3">
                    <div className="text-base font-normal text-black ">
                        <div className="text-xl font-bold ml-3 mb-2">
                            Description
                        </div>
                        <div className="border-b-[1px] border-gray-300"></div>
                        <br />
                        {post.description ? post.description : ""}
                        <div className="border-b-[1px] border-gray-300 mt-4"></div>
                        <br />
                        <div
                            className="overflow-hidden text-[#1C252E] font-medium text-base content-html"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        ></div>
                    </div>
                    <div className="border-b-[1px] border-dotted border-gray-300 my-2"></div>
                    <div className="flex gap-2">
                        {post.tags &&
                            post.tags.map((tag, index) => {
                                return (
                                    <div
                                        key={tag.id}
                                        className="text-gray-600 text-[13px] hover:bg-gray-300 transition-all delay-100 ease-linear font-semibold bg-gray-200 px-3 py-2 rounded-lg"
                                    >
                                        {tag.name}
                                    </div>
                                );
                            })}
                    </div>
                    <div className="flex gap-4 items-center my-2">
                        <div
                            onClick={handleLike}
                            className="cursor-pointer flex gap-1.5 items-center"
                        >
                            {post.liked ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    className="w-6 h-6"
                                    role="img"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#ff5630"
                                        d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    className="w-6 h-6"
                                    role="img"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#637381"
                                        d="M2 9.137C2 14 6.02 16.591 8.962 18.911C10 19.729 11 20.5 12 20.5s2-.77 3.038-1.59C17.981 16.592 22 14 22 9.138S16.5.825 12 5.501C7.5.825 2 4.274 2 9.137"
                                    ></path>
                                </svg>
                            )}

                            <span className="text-sm">{post.likes}</span>
                        </div>
                        <div className="flex gap-1.5 items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                className="w-6 h-[22px]"
                                role="img"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#637381"
                                    d="M19.07 4.93a10 10 0 0 0-16.28 11a1.06 1.06 0 0 1 .09.64L2 20.8a1 1 0 0 0 .27.91A1 1 0 0 0 3 22h.2l4.28-.86a1.26 1.26 0 0 1 .64.09a10 10 0 0 0 11-16.28ZM8 13a1 1 0 1 1 1-1a1 1 0 0 1-1 1m4 0a1 1 0 1 1 1-1a1 1 0 0 1-1 1m4 0a1 1 0 1 1 1-1a1 1 0 0 1-1 1"
                                ></path>
                            </svg>
                            <span className="text-sm">
                                {post.totalComment || 0}
                            </span>
                        </div>
                    </div>
                    <div className="border-b-[1px] border-dotted border-gray-300"></div>
                    <div>
                        <h2 className="text-2xl font-bold mt-10 mb-6">
                            Comments
                        </h2>
                        <div className="flex flex-col items-end gap-6">
                            <div className="w-full">
                                <InputComponent
                                    value={comment.content}
                                    autoFocus={true}
                                    noLabel={true}
                                    placeholder={
                                        "Write some of your comment..."
                                    }
                                    onHandleChange={(e) =>
                                        setComment({
                                            ...comment,
                                            content: e.target.value,
                                        })
                                    }
                                    size="lg"
                                ></InputComponent>
                            </div>
                            <button
                                type="button"
                                onClick={handleSendNewComment}
                                className="px-3 hover:opacity-85 cursor-pointer text-sm py-2 text-white rounded-lg font-bold bg-[#1C252E]"
                            >
                                Post Comment
                            </button>
                        </div>
                        <div className="border-b-[1px] border-dotted border-gray-300 mt-10 mb-4"></div>
                        {/*----------------------------COMEMENT---------------------------------- */}
                        <div
                            ref={containerCommentRef}
                            className="mt-6 pb-12 flex flex-col gap-4"
                        >
                            {comments &&
                                comments.map((item, index) => {
                                    if (item.parentId !== null)
                                        return (
                                            <span
                                                key={item.id}
                                                className="disabled"
                                            ></span>
                                        );
                                    const date = new Date(
                                        item.createdAt
                                    ).toLocaleDateString();

                                    let timeElapsed = getTimeElapsed(
                                        item.createdAt
                                    );
                                    return (
                                        <div key={item.id}>
                                            <div
                                                className="cmt flex gap-3 w-full text-sm relative"
                                                data-watch={item.id}
                                            >
                                                <div className="w-12 h-12 ">
                                                    <div>
                                                        <img
                                                            src={
                                                                item.author
                                                                    .avatarUrl ||
                                                                "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-2.webp"
                                                            }
                                                            alt=""
                                                            loading="lazy"
                                                            className="w-full rounded-full"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1 flex flex-col">
                                                    <div className="flex justify-between">
                                                        <span className="font-semibold text-[#1c252e] leading-6">
                                                            {item.email ===
                                                                post.email && (
                                                                <div className="flex items-center text-xs text-gray-500 font-bold">
                                                                    Author
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        className="w-4 h-4"
                                                                        fill="none"
                                                                        viewBox="0 0 128 128"
                                                                        id="write"
                                                                    >
                                                                        <path
                                                                            stroke="#000"
                                                                            strokeWidth="6"
                                                                            d="M80.2397 34.6569C83.3639 31.5327 88.4292 31.5327 91.5534 34.6569L94.2965 37.3999C97.4207 40.5241 97.4207 45.5894 94.2965 48.7136L74.5172 68.4929L50.9865 92.0236C50.6228 92.3873 50.133 92.5969 49.6188 92.6089L39.1704 92.8519C37.4593 92.8916 36.0617 91.4941 36.1015 89.7829L36.3445 79.3345C36.3564 78.8203 36.566 78.3305 36.9297 77.9668L60.4605 54.4361L80.2397 34.6569Z"
                                                                        ></path>
                                                                        <path
                                                                            stroke="#000"
                                                                            strokeLinecap="round"
                                                                            strokeWidth="6"
                                                                            d="M73.5132 42.7222L86.9007 56.1096M96.0001 92H69.0001"
                                                                        ></path>
                                                                    </svg>
                                                                </div>
                                                            )}
                                                            {item.author
                                                                .firstName +
                                                                " " +
                                                                item.author
                                                                    .lastName}
                                                        </span>
                                                        <div
                                                            onClick={(e) =>
                                                                handleReply(
                                                                    e,
                                                                    item,
                                                                    null,
                                                                    false
                                                                )
                                                            }
                                                            className={clsx(
                                                                "font-bold px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all delay-50 ease-linear cursor-pointer flex gap-2 text-xs ",
                                                                {
                                                                    "text-[#1c252e]":
                                                                        item.id !==
                                                                        showReplyBox.id,
                                                                    "text-green":
                                                                        item.id ===
                                                                        showReplyBox.id,
                                                                }
                                                            )}
                                                        >
                                                            {showReplyBox.id ===
                                                            item.id ? (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    aria-hidden="true"
                                                                    role="img"
                                                                    className="w-4 h-4"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        fill="#00a76f"
                                                                        d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"
                                                                    ></path>
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    aria-hidden="true"
                                                                    role="img"
                                                                    className="w-4 h-4"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        fill="#1c252e"
                                                                        d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"
                                                                    ></path>
                                                                </svg>
                                                            )}
                                                            Reply
                                                        </div>
                                                    </div>

                                                    <div>{item.content}.</div>
                                                    <div className="text-gray-500 mt-1.5 mb-2 text-[13px] font-normal">
                                                        {date}
                                                        <span className="mx-1.5">
                                                            -
                                                        </span>
                                                        {timeElapsed}
                                                    </div>
                                                    {showReplyBox.id ===
                                                        item.id && (
                                                        <div
                                                            className={clsx(
                                                                "mt-6"
                                                            )}
                                                        >
                                                            <div className="w-9 h-[67px] top-[100px] flex-1 absolute left-6 border-custom -translate-y-1/2"></div>
                                                            <InputComponent
                                                                autoFocus={true}
                                                                value={
                                                                    subComment.content
                                                                }
                                                                onHandleChange={(
                                                                    e
                                                                ) =>
                                                                    setSubComment(
                                                                        {
                                                                            ...subComment,
                                                                            content:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        }
                                                                    )
                                                                }
                                                                label={false}
                                                                placeholder={
                                                                    "Reply to " +
                                                                    item.author
                                                                        .firstName +
                                                                    " " +
                                                                    item.author
                                                                        .lastName +
                                                                    "..."
                                                                }
                                                            ></InputComponent>
                                                            <button
                                                                type="button"
                                                                onClick={(e) =>
                                                                    handleSendNewComment(
                                                                        e,
                                                                        true
                                                                    )
                                                                }
                                                                className="float-right px-3 mt-3 hover:opacity-85 cursor-pointer text-sm py-2 text-white rounded-lg font-bold bg-[#1C252E]"
                                                            >
                                                                Post Comment
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {item.replies &&
                                                item.replies.length > 0 &&
                                                !listOpenSubComment.includes(
                                                    item.id
                                                ) && (
                                                    <div
                                                        className="flex gap-3 w-full text-sm relative"
                                                        onClick={() =>
                                                            setListOpenSubComment(
                                                                [
                                                                    ...listOpenSubComment,
                                                                    item.id,
                                                                ]
                                                            )
                                                        }
                                                    >
                                                        <div className="w-9 h-8 flex-1 absolute left-6 border-custom -translate-y-1/2"></div>
                                                        {showReplyBox.id ===
                                                            item.id && (
                                                            <div className="-top-[100px] h-[100px] absolute border-left-custom flex-1 left-6 w-9"></div>
                                                        )}
                                                        <div className="pl-16 font-semibold text-black hover:opacity-75 cursor-pointer flex-1 h-8  leading-8 flex flex-col">
                                                            Display{" "}
                                                            {
                                                                item.replies
                                                                    .length
                                                            }{" "}
                                                            Replies
                                                        </div>
                                                    </div>
                                                )}

                                            {item.replies &&
                                                item.replies.length > 0 &&
                                                listOpenSubComment.includes(
                                                    item.id
                                                ) &&
                                                item.replies.map(
                                                    (subCmt, index) => {
                                                        let userName =
                                                            subCmt.author
                                                                .firstName +
                                                            " " +
                                                            subCmt.author
                                                                .lastName;
                                                        let userAvatarUrl =
                                                            subCmt.author
                                                                .avatarUrl;
                                                        let timeElapsed =
                                                            getTimeElapsed(
                                                                subCmt.createdAt
                                                            );

                                                        return (
                                                            <>
                                                                <div
                                                                    key={
                                                                        subCmt.id
                                                                    }
                                                                    className="relative cmt"
                                                                    data-watch={
                                                                        item.id
                                                                    }
                                                                >
                                                                    <div className="w-9 h-[60%] -top-[14px]  flex-1 absolute left-6 border-custom "></div>
                                                                    {showReplyBox.id ===
                                                                        item.id && (
                                                                        <div className="w-9 h-[100%] -top-[88px]  flex-1 absolute left-6 border-left-custom "></div>
                                                                    )}
                                                                    <div
                                                                        key={
                                                                            subCmt.id
                                                                        }
                                                                        className="pl-16 flex gap-3 pt-6 w-full text-sm"
                                                                    >
                                                                        <div className="w-12 h-12">
                                                                            <div>
                                                                                <img
                                                                                    src={
                                                                                        userAvatarUrl ||
                                                                                        "https://api-prod-minimal-v610.pages.dev/assets/images/avatar/avatar-2.webp"
                                                                                    }
                                                                                    alt=""
                                                                                    loading="lazy"
                                                                                    className="w-full rounded-full"
                                                                                />
                                                                            </div>
                                                                            <div className="w-[2px] bg-gray-400"></div>
                                                                        </div>
                                                                        <div className="flex-1 flex flex-col">
                                                                            <div className="flex justify-between">
                                                                                <span className="font-semibold text-[#1c252e] leading-6">
                                                                                    {
                                                                                        userName
                                                                                    }
                                                                                </span>
                                                                                <div
                                                                                    onClick={(
                                                                                        e
                                                                                    ) =>
                                                                                        handleReply(
                                                                                            e,
                                                                                            subCmt,
                                                                                            item.id,
                                                                                            true
                                                                                        )
                                                                                    }
                                                                                    className={clsx(
                                                                                        "font-bold px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all delay-50 ease-linear cursor-pointer flex gap-2 text-xs ",
                                                                                        {
                                                                                            "text-[#1c252e]":
                                                                                                subCmt.id !==
                                                                                                showReplyBox.id,
                                                                                            "text-green":
                                                                                                subCmt.id ===
                                                                                                showReplyBox.id,
                                                                                        }
                                                                                    )}
                                                                                >
                                                                                    {showReplyBox.id ===
                                                                                    subCmt.id ? (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            aria-hidden="true"
                                                                                            role="img"
                                                                                            className="w-4 h-4"
                                                                                            viewBox="0 0 24 24"
                                                                                        >
                                                                                            <path
                                                                                                fill="#00a76f"
                                                                                                d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"
                                                                                            ></path>
                                                                                        </svg>
                                                                                    ) : (
                                                                                        <svg
                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                            aria-hidden="true"
                                                                                            role="img"
                                                                                            className="w-4 h-4"
                                                                                            viewBox="0 0 24 24"
                                                                                        >
                                                                                            <path
                                                                                                fill="#1c252e"
                                                                                                d="m11.4 18.161l7.396-7.396a10.3 10.3 0 0 1-3.326-2.234a10.3 10.3 0 0 1-2.235-3.327L5.839 12.6c-.577.577-.866.866-1.114 1.184a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.362 4.083a1.06 1.06 0 0 0 1.342 1.342l4.083-1.362c.775-.258 1.162-.387 1.526-.56q.647-.308 1.211-.749c.318-.248.607-.537 1.184-1.114m9.448-9.448a3.932 3.932 0 0 0-5.561-5.561l-.887.887l.038.111a8.75 8.75 0 0 0 2.092 3.32a8.75 8.75 0 0 0 3.431 2.13z"
                                                                                            ></path>
                                                                                        </svg>
                                                                                    )}
                                                                                    Reply
                                                                                </div>
                                                                            </div>

                                                                            <div>
                                                                                {subCmt.replyToUserName !==
                                                                                    subCmt.userName && (
                                                                                    <span className="font-semibold pr-2 text-black">
                                                                                        @
                                                                                        {
                                                                                            subCmt.replyToUserName
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                                {
                                                                                    subCmt.content
                                                                                }

                                                                                .
                                                                            </div>
                                                                            <div className="text-gray-500 mt-1.5 mb-2 text-[13px] font-normal">
                                                                                {
                                                                                    date
                                                                                }
                                                                                <span className="mx-1.5">
                                                                                    -
                                                                                </span>
                                                                                {
                                                                                    timeElapsed
                                                                                }
                                                                            </div>
                                                                            {index !==
                                                                                item
                                                                                    .replies
                                                                                    .length -
                                                                                    1 && (
                                                                                <div className="w-9 h-full flex-1 absolute left-6 border-left-custom"></div>
                                                                            )}
                                                                            {showReplyBox.grandParentId ===
                                                                                item.id && (
                                                                                <div className="w-9 h-full flex-1 absolute left-6 border-left-custom"></div>
                                                                            )}
                                                                            {/* <div className="border-b-[1px] border-dotted border-gray-300  pt-6"></div> */}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    }
                                                )}
                                            <div
                                                className={clsx(
                                                    "mt-6 pl-16 relative",
                                                    {
                                                        hidden:
                                                            showReplyBox.grandParentId !==
                                                            item.id,
                                                    }
                                                )}
                                            >
                                                <div className="w-9 h-full flex-1 absolute left-6 border-custom -translate-y-1/2"></div>
                                                <InputComponent
                                                    autoFocus={true}
                                                    value={subComment.content}
                                                    onHandleChange={(e) =>
                                                        setSubComment({
                                                            ...subComment,
                                                            content:
                                                                e.target.value,
                                                        })
                                                    }
                                                    label={false}
                                                    placeholder={
                                                        "Reply" +
                                                        " " +
                                                        showReplyBox.userName +
                                                        "..."
                                                    }
                                                ></InputComponent>
                                                <button
                                                    type="button"
                                                    onClick={(e) =>
                                                        handleSendNewComment(
                                                            e,
                                                            true
                                                        )
                                                    }
                                                    className="float-right px-3 mt-3 hover:opacity-85 cursor-pointer text-sm py-2 text-white rounded-lg font-bold bg-[#1C252E]"
                                                >
                                                    Post Comment
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            {pagination.totalPage > 1 && (
                                <PaginationItem
                                    count={pagination.totalPage}
                                    handleChange={handleChangePagination}
                                ></PaginationItem>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-md pb-20">
                <h2 className="text-2xl font-bold mb-6">Recent Posts</h2>
                <ListPost data={recentPosts}></ListPost>
            </div>
        </>
    );
};

export default ViewPost;

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
                                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                    aria-hidden="true"
                                                                    role="img"
                                                                    className="w-4 h-4 mr-3 component-iconify MuiBox-root css-1t9pz9x iconify iconify--solar"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        fill="white"
                                                                        d="M3 6.386c0-.484.345-.877.771-.877h2.665c.529-.016.996-.399 1.176-.965l.03-.1l.115-.391c.07-.24.131-.45.217-.637c.338-.739.964-1.252 1.687-1.383c.184-.033.378-.033.6-.033h3.478c.223 0 .417 0 .6.033c.723.131 1.35.644 1.687 1.383c.086.187.147.396.218.637l.114.391l.03.1c.18.566.74.95 1.27.965h2.57c.427 0 .772.393.772.877s-.345.877-.771.877H3.77c-.425 0-.77-.393-.77-.877"
                                                                    ></path>
                                                                    <path
                                                                        fill="white"
                                                                        fill-rule="evenodd"
                                                                        d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.339 1.181-5.245l.267-4.188c.1-1.577.15-2.366-.303-2.865c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5c-.454.5-.404 1.288-.303 2.865l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886m-1.35-9.811c-.04-.434-.408-.75-.82-.707c-.413.043-.713.43-.672.864l.5 5.263c.04.434.408.75.82.707c.413-.043.713-.43.672-.864zm4.329-.707c.412.043.713.43.671.864l-.5 5.263c-.04.434-.409.75-.82.707c-.413-.043-.713-.43-.672-.864l.5-5.263c.04-.434.409-.75.82-.707"
                                                                        clipRule="evenodd"
                                                                    ></path>
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                    aria-hidden="true"
                                                                    role="img"
                                                                    className="w-4 h-4 mr-3 component-iconify MuiBox-root css-1t9pz9x iconify iconify--solar"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        fill="#ff5630"
                                                                        d="M3 6.386c0-.484.345-.877.771-.877h2.665c.529-.016.996-.399 1.176-.965l.03-.1l.115-.391c.07-.24.131-.45.217-.637c.338-.739.964-1.252 1.687-1.383c.184-.033.378-.033.6-.033h3.478c.223 0 .417 0 .6.033c.723.131 1.35.644 1.687 1.383c.086.187.147.396.218.637l.114.391l.03.1c.18.566.74.95 1.27.965h2.57c.427 0 .772.393.772.877s-.345.877-.771.877H3.77c-.425 0-.77-.393-.77-.877"
                                                                    ></path>
                                                                    <path
                                                                        fill="#ff5630"
                                                                        fill-rule="evenodd"
                                                                        d="M11.596 22h.808c2.783 0 4.174 0 5.08-.886c.904-.886.996-2.339 1.181-5.245l.267-4.188c.1-1.577.15-2.366-.303-2.865c-.454-.5-1.22-.5-2.753-.5H8.124c-1.533 0-2.3 0-2.753.5c-.454.5-.404 1.288-.303 2.865l.267 4.188c.185 2.906.277 4.36 1.182 5.245c.905.886 2.296.886 5.079.886m-1.35-9.811c-.04-.434-.408-.75-.82-.707c-.413.043-.713.43-.672.864l.5 5.263c.04.434.408.75.82.707c.413-.043.713-.43.672-.864zm4.329-.707c.412.043.713.43.671.864l-.5 5.263c-.04.434-.409.75-.82.707c-.413-.043-.713-.43-.672-.864l.5-5.263c.04-.434.409-.75.82-.707"
                                                                        clip-rule="evenodd"
                                                                    ></path>
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
