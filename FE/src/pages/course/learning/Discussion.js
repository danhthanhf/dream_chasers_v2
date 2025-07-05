import * as utils from "../../../util/index";
import * as userService from "../../../api/apiService/userService";
import * as securedService from "../../../api/apiService/securedService";
import { useSelector } from "react-redux";
import { userSelector } from "../../../redux/selector";
import { useEffect, useRef, useState } from "react";
import { FilterAskType } from "../../../constants/enum";
import { toast } from "sonner";
import websocketService from "../../../service/WebsocketService";
import PaginationItem from "../../../component/Pagination";
import { sessionExpired } from "../../../api/instance";
import clsx from "clsx";
import ReactQuill from "react-quill-new";
import Ink from "react-ink";
import SelectComponent from "../../../component/select/SelectComponent";
import "react-quill-new/dist/quill.snow.css";
import Editor from "../../../component/Editor";

const DiscussionTab = ({ courseId, lessonId = 1 }) => {
    const user = useSelector(userSelector);
    const [listOpenSubComment, setListOpenSubComment] = useState([]);

    const initAsk = {
        author: {
            email: user && user.email,
            avatarUrl: user && user.avatarUrl,
            firstName: user && user.firstName,
            lastName: user && user.lastName,
        },
        title: "",
        content: "",
        courseId: courseId,
        lessonId: null,
    };

    const [filter, setFilter] = useState({
        lecture: 0, // 0: all lecture, 1: lecture1
        order: "asc", // asc, desc
        typeOfQuestion: FilterAskType.ALL, // 0: all, 1: my question, 2: question I am following
    });
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10,
    });
    const [ask, setAsk] = useState(initAsk);
    const [askPage, setAskPage] = useState({
        totalPage: 1,
        totalElement: 0,
        data: [
            {
                content: "",
                courseId: "",
                lessonId: "",
                lessonTitle: "",
                email: "",
                avatarUrl: "",
                createdAt: "",
            },
        ],
    });
    const [listOpenSubAsk, setListOpenSubAsk] = useState([]);
    const [showReplyBox, setShowReplyBox] = useState({
        id: null,
    });
    const [subAsk, setSubAsk] = useState({
        ...initAsk,
        parentId: null,
    });

    const [editComment, setEditComment] = useState({ id: "" });

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
            setAskPage((prev) => ({
                ...prev,
                data: prev.data.map((cmt) => {
                    if (cmt.id === payloadData.parentId) {
                        if (cmt.replies) {
                            cmt.replies = [payloadData, ...cmt.replies];
                        } else cmt.replies = [payloadData];
                    }
                    return cmt;
                }),
                totalElement: prev.totalElement + 1,
            }));
        } else {
            setAskPage((prev) => ({
                ...prev,
                data: [payloadData, ...prev.data],
                totalElement: prev.totalElement + 1,
            }));
        }
    };
    const SendValue = (sub, content) => {
        let data = {
            lessonid: lessonId,
        };
        sub
            ? (data = {
                  ...data,
                  ...subAsk,
                  content,
              })
            : (data = {
                  ...data,
                  ...ask,
              });
        websocketService.sendMessage(
            `/app/courses/${courseId}/lessons/${lessonId}/comments`,
            data
        );
        sub
            ? setSubAsk({ ...subAsk, content: "" })
            : setSubAsk({ ...ask, content: "" });
    };

    const handleReply = (e, ask, grandParentId, isSub = false) => {
        if (ask.id === showReplyBox.id) {
            setShowReplyBox({
                id: null,
            });
        } else {
            setSubAsk({
                ...subAsk,
                repliedUser: {
                    email: ask.author.email,
                    firstName: ask.author.firstName,
                    lastName: ask.author.lastName,
                },
                content: "",
                parentId: ask.id,
            });
            setShowReplyBox({
                id: ask.id,
                grandParentId: grandParentId,
                userName: ask.author.firstName + ask.author.lastName,
                isSub,
            });
            setEditComment({ id: null });
        }
        utils.showElementToCenter(e);
    };

    const handleSendNewAsk = (e, sub = false, content) => {
        e.preventDefault();
        console.log(content);
        return;
        if (!user) {
            sessionExpired();
            return;
        }
        setSubAsk((prev) => ({
            ...prev,
            content,
        }));
        SendValue(sub, content);
    };

    const handleEditComment = (cmt) => {
        if (cmt.id === editComment.id) {
            setEditComment({ id: null });
            return;
        }
        setEditComment({ ...cmt });
        setShowReplyBox((prev) => ({ ...prev, id: null }));
    };

    const handleDeleteComment = (cmt) => {
        toast.promise(userService.removeCommentByIdInLesson(cmt.id), {
            loading: "Loading...",
            success: () => {
                let commentUpdate = [];
                for (let c of askPage.data) {
                    let replies = [];
                    for (let reply of c.replies) {
                        if (reply.id !== cmt.id) {
                            replies.push(reply);
                        }
                    }
                    if (c.id !== cmt.id) {
                        c.replies = replies;
                        commentUpdate.push(c);
                    }
                }

                setAskPage((prev) => ({ ...prev, data: commentUpdate }));

                return "Delete comment successfully";
            },
            error: (error) => {
                console.log(error);
                return error.mess;
            },
        });
    };

    useEffect(() => {
        websocketService.subscribe(
            `/lessons/${lessonId}/comments`,
            onMessageReceived
        );
        setAsk((prev) => ({
            ...prev,
            courseId,
            lessonId,
        }));
        setSubAsk((prev) => ({
            ...prev,
            courseId,
            lessonId,
        }));
    }, [lessonId, courseId]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await securedService.getAskByFilter(
                    courseId,
                    filter.lecture,
                    filter.order,
                    filter.typeOfQuestion,
                    pagination.page,
                    pagination.size
                );
                setAskPage({
                    data: res.content,
                    totalElement: res.totalElements,
                    totalPage: res.totalPages,
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, [courseId, filter, pagination, lessonId]);

    const handleFollowing = (askId) => {
        toast.promise(userService.followAsk(askId), {
            loading: "Following...",
            success: (res) => {
                return "Following successfully";
            },
            error: (error) => {
                return error?.message;
            },
        });
    };

    const handleChangePagination = (e, value) => {
        setPagination((prev) => {
            return {
                ...prev,
                page: value - 1,
            };
        });
    };

    const updateDataAsk = (data) => {
        setAskPage((prev) => ({
            ...prev,
            data: data,
        }));
    };

    const updateComment = (content) => {
        toast.promise(
            userService.updateComment({
                ...editComment,
                content,
            }),
            {
                loading: "Loading...",
                success: (result) => {
                    let commentUpdate = askPage.data.map((c) => {
                        if (c.id === editComment.id) {
                            c.content = content;
                        }
                        return c;
                    });
                    updateDataAsk(commentUpdate);
                    setEditComment({ id: "" });
                    return "Update comment successfully";
                },
                error: (error) => {
                    return error.mess;
                },
            }
        );
    };
    console.log(askPage.data);

    const handleUpdateContentAndSendSubAsk = (content) => {
        if (!user) {
            sessionExpired();
            return;
        }
        setSubAsk((prev) => ({
            ...prev,
            content,
        }));
        SendValue(true, content);
    };

    return (
        <div className="w-full center">
            <div className="w-2/3 center flex-col mt-4 gap-2">
                <div className="flex w-full flex-col gap-2">
                    <div
                        className={clsx(
                            `relative items-center border-1 transition-all ease-linear focus-within:border-black border-gray-300 hover:border-black text-sm font-normal mb-2`
                        )}
                    >
                        <div className="py-2.5 px-2.5">
                            <label
                                className="text-[12px] absolute -top-2 left-2 font-semibold bg-white"
                                htmlFor="titleAsdk"
                            >
                                Title
                            </label>

                            <input
                                type="text"
                                value={ask.title}
                                id="titleAsdk"
                                onChange={(e) => {
                                    setAsk((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }));
                                }}
                                placeholder={"Title question"}
                                className={clsx("outline-none w-full")}
                            />
                        </div>
                    </div>
                    <ReactQuill
                        value={ask.content || ""}
                        placeholder="Ask a question"
                        onChange={(content) => {
                            setAsk((prev) => ({
                                ...prev,
                                content: content,
                            }));
                        }}
                        className="w-full"
                        modules={toolbar}
                        formats={formats}
                    ></ReactQuill>

                    <style jsx>{`
                        .ql-editor {
                            font-family: "Public Sans", sans-serif !important;
                        }
                    `}</style>
                    <div className="flex w-full justify-end text-sm">
                        <button
                            onClick={handleSendNewAsk}
                            className="relative px-3 py-1.5 bg-black text-white font-semibold rounded"
                        >
                            <Ink></Ink>
                            Send question
                        </button>
                    </div>
                </div>
                <div className="w-full border-b-[1px] border-dotted border-gray-300 mt-10 mb-4"></div>

                <div className="flex gap-4 mt-2 w-full justify-start">
                    <div className="flex items-center gap-2 flex-1">
                        <div className="mb-2 text-sm">Filter:</div>
                        <div className="h-11 flex-1">
                            <SelectComponent
                                value={filter?.lecture}
                                data={[
                                    { label: "All lectures", value: "0" },
                                    {
                                        label: "Current lecture",
                                        value: `${lessonId}`,
                                    },
                                ]}
                                placeholder={"All lectures"}
                                borderRadius={"rounded-none"}
                                handleChange={(e) => {
                                    setFilter({ ...filter, lecture: e });
                                }}
                            ></SelectComponent>
                        </div>
                    </div>
                    <div className="gap-2 flex items-center flex-1">
                        <div className="text-sm">Order by:</div>
                        <div className="h-11 flex-1">
                            <SelectComponent
                                value={filter?.order}
                                placeholder={"Sort by most recent"}
                                data={[
                                    {
                                        label: "Sort by most recent",
                                        value: "desc",
                                    },
                                    { label: "Sort by oldest", value: "asc" },
                                ]}
                                borderRadius={"rounded-none"}
                                handleChange={(e) => {
                                    setFilter({ ...filter, order: e });
                                }}
                            ></SelectComponent>
                        </div>
                    </div>
                </div>

                <div className="center gap-2 w-full">
                    <div className="mb-2 text-sm">Filter Question:</div>
                    <div className="h-11 flex-1">
                        <SelectComponent
                            value={filter?.typeOfQuestion}
                            data={[
                                {
                                    label: "All",
                                    value: "ALL",
                                },
                                {
                                    label: "The question I am following",
                                    value: "MY_FOLLOWING",
                                },
                                {
                                    label: "My question",
                                    value: "MY_ASK",
                                },
                            ]}
                            placeholder={"Filter question"}
                            borderRadius={"rounded-none"}
                            handleChange={(e) => {
                                setFilter({ ...filter, typeOfQuestion: e });
                            }}
                        ></SelectComponent>
                    </div>
                </div>
                <div className="w-full border-b-[1px] border-dotted border-gray-300 mt-10 mb-4"></div>

                <div className="w-full">
                    <div className="text-lg">
                        Questions{" "}
                        <span className="text-gray-500">
                            ({askPage.totalElement})
                        </span>
                    </div>
                    <div className="">
                        <div className="mt-6 pb-12 flex flex-col gap-4">
                            <div className="mt-6 pb-12 flex flex-col gap-4">
                                {askPage.data &&
                                    askPage.data.map((item, index) => {
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

                                        let timeElapsed = utils.getTimeElapsed(
                                            item.createdAt
                                        );
                                        return (
                                            <div
                                                key={
                                                    item.id + Math.random(1000)
                                                }
                                            >
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
                                                                {item.author
                                                                    .firstName +
                                                                    " " +
                                                                    item.author
                                                                        .lastName}
                                                            </span>
                                                            <div className="flex gap-2.5 center">
                                                                {item.author
                                                                    .email !==
                                                                    user.email && (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleFollowing(
                                                                                item.id
                                                                            )
                                                                        }
                                                                        className={clsx(
                                                                            "flex gap-2 center font-bold text-xs hover:bg-gray-200 transition-all px-2 py-1 rounded-lg cursor-pointer",
                                                                            {
                                                                                "text-yellow-500":
                                                                                    item.isFollwed,
                                                                            }
                                                                        )}
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill={
                                                                                item.isFollwed
                                                                                    ? "currentColor"
                                                                                    : "none"
                                                                            }
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth="1.5"
                                                                            stroke="currentColor"
                                                                            className="w-5 h-5"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                                                            />
                                                                        </svg>
                                                                        254
                                                                    </div>
                                                                )}
                                                                {item.author
                                                                    ?.email ===
                                                                    user?.email && (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleEditComment(
                                                                                item
                                                                            )
                                                                        }
                                                                        className={clsx(
                                                                            "font-bold px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all delay-50 ease-linear cursor-pointer flex gap-2 text-xs relative",
                                                                            {
                                                                                "bg-yellow-500 text-white":
                                                                                    item.id ===
                                                                                    editComment.id,
                                                                            }
                                                                        )}
                                                                    >
                                                                        <Ink></Ink>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            enableBackground="new 0 0 32 32"
                                                                            viewBox="0 0 32 32"
                                                                            strokeWidth={
                                                                                1.5
                                                                            }
                                                                            className="w-4 h-4"
                                                                            fill="currentColor"
                                                                        >
                                                                            <path d="M12.82373,12.95898l-1.86279,6.21191c-0.1582,0.52832-0.01367,1.10156,0.37646,1.49121c0.28516,0.28516,0.66846,0.43945,1.06055,0.43945c0.14404,0,0.28906-0.02051,0.43066-0.06348l6.2124-1.8623c0.23779-0.07129,0.45459-0.2002,0.62988-0.37598L31.06055,7.41016C31.3418,7.12891,31.5,6.74707,31.5,6.34961s-0.1582-0.7793-0.43945-1.06055l-4.3501-4.34961c-0.58594-0.58594-1.53516-0.58594-2.12109,0L13.2002,12.3291C13.02441,12.50488,12.89551,12.7207,12.82373,12.95898z M15.58887,14.18262L25.6499,4.12109l2.22852,2.22852L17.81738,16.41113l-3.18262,0.9541L15.58887,14.18262z"></path>
                                                                            <path d="M30,14.5c-0.82861,0-1.5,0.67188-1.5,1.5v10c0,1.37891-1.12158,2.5-2.5,2.5H6c-1.37842,0-2.5-1.12109-2.5-2.5V6c0-1.37891,1.12158-2.5,2.5-2.5h10c0.82861,0,1.5-0.67188,1.5-1.5S16.82861,0.5,16,0.5H6C2.96729,0.5,0.5,2.96777,0.5,6v20c0,3.03223,2.46729,5.5,5.5,5.5h20c3.03271,0,5.5-2.46777,5.5-5.5V16C31.5,15.17188,30.82861,14.5,30,14.5z"></path>
                                                                        </svg>
                                                                        Edit
                                                                    </div>
                                                                )}
                                                                {item.author
                                                                    ?.email ===
                                                                    user?.email && (
                                                                    <div
                                                                        onClick={() =>
                                                                            handleDeleteComment(
                                                                                item
                                                                            )
                                                                        }
                                                                        className={clsx(
                                                                            "font-bold px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all delay-50 ease-linear cursor-pointer flex gap-2 text-xs relative text-orange-500"
                                                                        )}
                                                                    >
                                                                        <Ink></Ink>
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                            strokeWidth="2.5"
                                                                            stroke="currentColor"
                                                                            className="size-4"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                            />
                                                                        </svg>
                                                                        Delete
                                                                    </div>
                                                                )}
                                                                <div
                                                                    onClick={(
                                                                        e
                                                                    ) =>
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
                                                        </div>

                                                        {editComment?.id ===
                                                        item.id ? (
                                                            <div className="relative my-1 rounded-lg items-center transition-all ease-linear focus-within:border-black  ">
                                                                <div className="p-2 flex flex-col ">
                                                                    <Editor
                                                                        initValue={
                                                                            editComment?.content
                                                                        }
                                                                        handleSubmit={(
                                                                            content
                                                                        ) => {
                                                                            updateComment(
                                                                                content
                                                                            );
                                                                        }}
                                                                        textButton="Update"
                                                                    ></Editor>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="content-html"
                                                                dangerouslySetInnerHTML={{
                                                                    __html: item.content,
                                                                }}
                                                            ></div>
                                                        )}
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
                                                                <Editor
                                                                    placeholder={
                                                                        "Reply to " +
                                                                        subAsk
                                                                            ?.repliedUser
                                                                            ?.firstName +
                                                                        " " +
                                                                        subAsk
                                                                            ?.repliedUser
                                                                            ?.lastName +
                                                                        "..."
                                                                    }
                                                                    handleSubmit={
                                                                        handleUpdateContentAndSendSubAsk
                                                                    }
                                                                    textButton="send"
                                                                ></Editor>
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
                                                                utils.getTimeElapsed(
                                                                    subCmt.createdAt
                                                                );

                                                            return (
                                                                <div
                                                                    key={
                                                                        subCmt.id
                                                                    }
                                                                >
                                                                    <div
                                                                        className="relative cmt"
                                                                        data-watch={
                                                                            item.id
                                                                        }
                                                                    >
                                                                        <div
                                                                            key={
                                                                                subCmt.id
                                                                            }
                                                                            className="border-l-1 border-gray-200 pl-16 flex gap-3 pt-6 w-full text-sm"
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
                                                                                    <span className="font-semibold text-[#1c252e] leading-6 flex gap-2">
                                                                                        {
                                                                                            userName
                                                                                        }
                                                                                        {subCmt.repliedUser && (
                                                                                            <div className="font-normal italic">
                                                                                                to
                                                                                                <span className="font-semibold ml-1 underline">
                                                                                                    {subCmt
                                                                                                        ?.repliedUser
                                                                                                        ?.firstName +
                                                                                                        " " +
                                                                                                        subCmt
                                                                                                            ?.repliedUser
                                                                                                            ?.lastName}
                                                                                                </span>
                                                                                            </div>
                                                                                        )}
                                                                                    </span>
                                                                                    <div className="center gap-2.5">
                                                                                        {/* <div
                                                                                            onClick={() =>
                                                                                                handleFollowing(
                                                                                                    item.id
                                                                                                )
                                                                                            }
                                                                                            className={clsx(
                                                                                                "flex gap-2 center font-bold text-xs hover:bg-gray-200 transition-all px-2 py-1 rounded-lg cursor-pointer",
                                                                                                {
                                                                                                    "text-yellow-500":
                                                                                                        item.isFollwed,
                                                                                                }
                                                                                            )}
                                                                                        >
                                                                                            <svg
                                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                                fill={
                                                                                                    item.isFollwed
                                                                                                        ? "currentColor"
                                                                                                        : "none"
                                                                                                }
                                                                                                viewBox="0 0 24 24"
                                                                                                strokeWidth="1.5"
                                                                                                stroke="currentColor"
                                                                                                className="w-5 h-5"
                                                                                            >
                                                                                                <path
                                                                                                    strokeLinecap="round"
                                                                                                    strokeLinejoin="round"
                                                                                                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                                                                                />
                                                                                            </svg>
                                                                                            254
                                                                                        </div> */}
                                                                                        {subCmt
                                                                                            .author
                                                                                            ?.email ===
                                                                                            user?.email && (
                                                                                            <div
                                                                                                onClick={() =>
                                                                                                    handleEditComment(
                                                                                                        subCmt
                                                                                                    )
                                                                                                }
                                                                                                className={clsx(
                                                                                                    "font-bold px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all delay-50 ease-linear cursor-pointer flex gap-2 text-xs relative",
                                                                                                    {
                                                                                                        "bg-yellow-500 text-white":
                                                                                                            subCmt.id ===
                                                                                                            editComment.id,
                                                                                                    }
                                                                                                )}
                                                                                            >
                                                                                                <Ink></Ink>
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    enableBackground="new 0 0 32 32"
                                                                                                    viewBox="0 0 32 32"
                                                                                                    strokeWidth={
                                                                                                        1.5
                                                                                                    }
                                                                                                    fill="currentColor"
                                                                                                    className="w-4 h-4"
                                                                                                >
                                                                                                    <path d="M12.82373,12.95898l-1.86279,6.21191c-0.1582,0.52832-0.01367,1.10156,0.37646,1.49121c0.28516,0.28516,0.66846,0.43945,1.06055,0.43945c0.14404,0,0.28906-0.02051,0.43066-0.06348l6.2124-1.8623c0.23779-0.07129,0.45459-0.2002,0.62988-0.37598L31.06055,7.41016C31.3418,7.12891,31.5,6.74707,31.5,6.34961s-0.1582-0.7793-0.43945-1.06055l-4.3501-4.34961c-0.58594-0.58594-1.53516-0.58594-2.12109,0L13.2002,12.3291C13.02441,12.50488,12.89551,12.7207,12.82373,12.95898z M15.58887,14.18262L25.6499,4.12109l2.22852,2.22852L17.81738,16.41113l-3.18262,0.9541L15.58887,14.18262z"></path>
                                                                                                    <path d="M30,14.5c-0.82861,0-1.5,0.67188-1.5,1.5v10c0,1.37891-1.12158,2.5-2.5,2.5H6c-1.37842,0-2.5-1.12109-2.5-2.5V6c0-1.37891,1.12158-2.5,2.5-2.5h10c0.82861,0,1.5-0.67188,1.5-1.5S16.82861,0.5,16,0.5H6C2.96729,0.5,0.5,2.96777,0.5,6v20c0,3.03223,2.46729,5.5,5.5,5.5h20c3.03271,0,5.5-2.46777,5.5-5.5V16C31.5,15.17188,30.82861,14.5,30,14.5z"></path>
                                                                                                </svg>
                                                                                                Edit
                                                                                            </div>
                                                                                        )}
                                                                                        {subCmt
                                                                                            .author
                                                                                            ?.email ===
                                                                                            user?.email && (
                                                                                            <div
                                                                                                onClick={() =>
                                                                                                    handleDeleteComment(
                                                                                                        subCmt
                                                                                                    )
                                                                                                }
                                                                                                className={clsx(
                                                                                                    "font-bold px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all delay-50 ease-linear cursor-pointer flex gap-2 text-xs relative text-orange-500"
                                                                                                )}
                                                                                            >
                                                                                                <Ink></Ink>
                                                                                                <svg
                                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                                    fill="none"
                                                                                                    viewBox="0 0 24 24"
                                                                                                    strokeWidth="2.5"
                                                                                                    stroke="currentColor"
                                                                                                    className="size-4"
                                                                                                >
                                                                                                    <path
                                                                                                        strokeLinecap="round"
                                                                                                        strokeLinejoin="round"
                                                                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                                                    />
                                                                                                </svg>
                                                                                                Delete
                                                                                            </div>
                                                                                        )}

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
                                                                                </div>
                                                                                <div>
                                                                                    {editComment?.id ===
                                                                                    subCmt.id ? (
                                                                                        <div className="relative my-1 ">
                                                                                            <div className="p-2 flex flex-col ">
                                                                                                <Editor
                                                                                                    textButton="Update"
                                                                                                    initValue={
                                                                                                        editComment.content
                                                                                                    }
                                                                                                    handleSubmit={(
                                                                                                        content
                                                                                                    ) =>
                                                                                                        updateComment(
                                                                                                            content
                                                                                                        )
                                                                                                    }
                                                                                                    placeholder={
                                                                                                        "Reply to " +
                                                                                                        subAsk
                                                                                                            ?.repliedUser
                                                                                                            ?.firstName +
                                                                                                        " " +
                                                                                                        subAsk
                                                                                                            ?.repliedUser
                                                                                                            ?.lastName +
                                                                                                        "..."
                                                                                                    }
                                                                                                ></Editor>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="">
                                                                                            <div
                                                                                                className="content-html"
                                                                                                dangerouslySetInnerHTML={{
                                                                                                    __html: subCmt.content,
                                                                                                }}
                                                                                            ></div>
                                                                                        </div>
                                                                                    )}
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
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
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
                                                    <Editor
                                                        handleSubmit={
                                                            handleUpdateContentAndSendSubAsk
                                                        }
                                                        placeholder={
                                                            "Reply to " +
                                                            subAsk.repliedUser
                                                                ?.firstName +
                                                            " " +
                                                            subAsk.repliedUser
                                                                ?.lastName +
                                                            "..."
                                                        }
                                                        initValue={""}
                                                        textButton="Reply"
                                                    ></Editor>
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
            </div>
        </div>
    );
};

export default DiscussionTab;

const toolbar = {
    toolbar: {
        container: [
            [{ header: "1" }, { header: "2" }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { indent: "-1" }, { indent: "+1" }],
            ["link", "image"],
            ["clean"],
            ["code-block"],
        ],
    },
    clipboard: {
        matchVisual: false,
    },
};

const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    // "bullet",
    "indent",
    "link",
    // "imageBlot",
    "code-block",
];
