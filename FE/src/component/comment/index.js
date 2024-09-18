import clsx from "clsx";
import styles from "./Comment.module.scss";
import { Menu, Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import avatar from "../../assets/images/avatar_25.jpg";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useSelector } from "react-redux";
import * as dataApi from "../../api/apiService/dataService";
import * as userApi from "../../api/apiService/authService";
import moment from "moment";
import { toast } from "sonner";

var stompClient = null;

export default function Comment({
    courseId,
    lessonId = -1,
    openModal,
    funcCloseModal,
}) {
    const userInfo = useSelector((state) => state.login.user);
    const initComment = {
        avatar: userInfo.avatar,
        email: userInfo.email,
        userName: userInfo.firstName + " " + userInfo.lastName,
        lessonId: lessonId,
    };
    const [comments, setComments] = useState([]);
    const [showReplyBox, setShowReplyBox] = useState(-1);
    const [subComment, setSubComment] = useState(initComment);
    const [comment, setComment] = useState(initComment);
    const [listViewSubComment, setListViewSubComment] = useState([]);
    const [quantityComment, setQuantiyComment] = useState({
        page: 0,
        size: 5,
    });
    const [totalComment, setTotalComment] = useState();
    let isFirstRender = useRef(true);

    const onError = (err) => {
        console.log(err);
    };

    const onMessageReceived = (payload) => {
        var payloadData = JSON.parse(payload.body);
        setComments((prev) => [payloadData, ...prev]);
    };
    const onConnected = () => {
        stompClient.subscribe(`/comment/lesson/${lessonId}`, onMessageReceived);
    };
    const connect = () => {
        const Sock = new SockJS("http://localhost:8080/ws");
        stompClient = over(Sock);
        stompClient.connect({}, onConnected, onError);
    };

    const onDisconnected = () => {
        console.log("Disconnect Websocket");
    };

    useEffect(() => {
        if (lessonId === "") {
            return;
        }

        const fetchApi = async () => {
            try {
                if (isFirstRender) {
                    connect();
                    isFirstRender.current = false;
                }
                const result = await dataApi.getComments(
                    `/lesson/${lessonId}/comments?page=${quantityComment.page}&size=${quantityComment.size}`
                );
                setComments(result.content.content);
                setTotalComment(result.content.totalElements);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
        return () => {
            if (stompClient) {
                stompClient.disconnect(onDisconnected, {});
            }
        };
    }, [lessonId, quantityComment.page, quantityComment.size]);
    const sendValue = (sub) => {
        if (stompClient) {
            let data = null;
            sub
                ? (data = {
                      ...subComment,
                      path: `/course/detail/${courseId}/openComment`,
                  })
                : (data = { ...comment });
            data = { ...data, lessonId: lessonId };
            stompClient.send(
                `/app/comment/lesson/${lessonId}`,
                {},
                JSON.stringify(data)
            );
            sub
                ? setSubComment({ ...subComment, content: "", parentId: "" })
                : setComment({ ...comment, content: "" });
        } else {
            console.log("stompClient is not connected");
        }
    };

    const handleSendComment = (sub) => {
        sendValue(sub);
        setShowReplyBox(-1);
    };

    const handleReply = (e, cmt) => {
        setShowReplyBox(cmt.id);
        setSubComment({
            ...subComment,
            content: "",
            parentId: cmt.id,
            replyToUser: cmt.userEmail,
            replyToUserName: cmt.userName,
        });
        e.currentTarget.scrollIntoView({ behavior: "smooth" });
    };

    const handleViewSubComment = (cmt) => {
        setListViewSubComment([...listViewSubComment, cmt.id]);
    };

    const handleHideSubCmt = (cmt) => {
        const newListViewSubComment = listViewSubComment.filter(
            (c) => c !== cmt.id
        );
        setListViewSubComment([...newListViewSubComment]);
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

    const handleRemoveComment = (cmtId) => {
        const fetchApi = async () => {
            try {
                await userApi.removeCommentById(userInfo.email, cmtId);
                const result = await dataApi.getComments(
                    `/lesson/${lessonId}/comments?pae=${quantityComment.page}&size=${quantityComment.size}`
                );
                setComments(result.content.content);
            } catch (error) {
                toast.error(error.mess);
                console.log(error);
            }
        };

        fetchApi();
    };

    const handleShowMoreComment = () => {
        setQuantiyComment({
            ...quantityComment,
            size: quantityComment.size + 5,
        });
    };

    return (
        <>
            <Transition appear show={openModal} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={funcCloseModal}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
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
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Q&A
                                    </Dialog.Title>
                                    <div className="mt-6">
                                        <div className="flex flex-col flex-none">
                                            <div
                                                className={clsx(
                                                    styles.cmt,
                                                    "flex"
                                                )}
                                            >
                                                <img
                                                    src={
                                                        userInfo.avatar ||
                                                        avatar
                                                    }
                                                    alt=""
                                                />
                                                <div
                                                    className={clsx(
                                                        styles.boxInput,
                                                        "flex-1"
                                                    )}
                                                >
                                                    <textarea
                                                        value={comment.content}
                                                        onChange={(e) =>
                                                            setComment({
                                                                ...comment,
                                                                content:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                        className={clsx(
                                                            styles.input,
                                                            "w-full"
                                                        )}
                                                        type="text"
                                                        placeholder="Do you have any questions about this lesson?"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSendComment(
                                                                false
                                                            )
                                                        }
                                                        className={clsx(
                                                            styles.btnSend,
                                                            "text-sm self-end flex-grow-0"
                                                        )}
                                                    >
                                                        Send
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={clsx(
                                            styles.cmtWrap,
                                            "flex flex-col gap-3 mt-8"
                                        )}
                                    >
                                        {comments &&
                                            comments.map((cmt, ind) => {
                                                let subComments =
                                                    getAllSubComments(
                                                        cmt.id,
                                                        comments
                                                    );
                                                subComments.sort(
                                                    (a, b) =>
                                                        new Date(a.date) -
                                                        new Date(b.date)
                                                );
                                                const totalSubComment =
                                                    subComments.length;
                                                const now = moment();
                                                const then = moment(cmt.date);
                                                const diffInSeconds = now.diff(
                                                    then,
                                                    "seconds"
                                                );
                                                const diffInMinutes = now.diff(
                                                    then,
                                                    "minutes"
                                                );
                                                const diffInHours = now.diff(
                                                    then,
                                                    "hours"
                                                );
                                                const diffInDays = now.diff(
                                                    then,
                                                    "days"
                                                );
                                                const diffInWeeks = now.diff(
                                                    then,
                                                    "weeks"
                                                );
                                                const diffInMonths = now.diff(
                                                    then,
                                                    "months"
                                                );
                                                const diffInYears = now.diff(
                                                    then,
                                                    "years"
                                                );

                                                let timeElapsed;
                                                if (diffInYears > 0) {
                                                    timeElapsed = `${diffInYears} year`;
                                                } else if (diffInMonths > 0) {
                                                    timeElapsed = `${diffInMonths} month`;
                                                } else if (diffInWeeks > 0) {
                                                    timeElapsed = `${diffInWeeks} week`;
                                                } else if (diffInDays > 0) {
                                                    timeElapsed = `${diffInDays} day`;
                                                } else if (diffInHours > 0) {
                                                    timeElapsed = `${diffInHours} hour`;
                                                } else if (diffInMinutes > 0) {
                                                    timeElapsed = `${diffInMinutes} minute`;
                                                } else {
                                                    timeElapsed = `${diffInSeconds} second`;
                                                }
                                                if (cmt.parentId !== 0)
                                                    return (
                                                        <span
                                                            key={ind}
                                                            className="disabled"
                                                        ></span>
                                                    );
                                                return (
                                                    <div key={ind}>
                                                        <div
                                                            className={clsx(
                                                                styles.cmtItem,
                                                                "flex flex-col flex-none"
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    styles.cmt,
                                                                    "flex"
                                                                )}
                                                            >
                                                                <img
                                                                    src={
                                                                        cmt.avatar ||
                                                                        avatar
                                                                    }
                                                                    alt=""
                                                                />
                                                                <div
                                                                    className={clsx(
                                                                        styles.cmtContent,
                                                                        "flex-1"
                                                                    )}
                                                                >
                                                                    <div
                                                                        className={clsx(
                                                                            styles.wrap
                                                                        )}
                                                                    >
                                                                        <span className="text-xs">
                                                                            {
                                                                                cmt.userName
                                                                            }
                                                                        </span>
                                                                        <div
                                                                            className={clsx(
                                                                                styles.content
                                                                            )}
                                                                        >
                                                                            {
                                                                                cmt.content
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div
                                                                        className={clsx(
                                                                            "mt-2 flex items-center gap-1.5"
                                                                        )}
                                                                    >
                                                                        <button
                                                                            className={clsx(
                                                                                styles.actionsCmt
                                                                            )}
                                                                            type="button"
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                handleReply(
                                                                                    e,
                                                                                    cmt
                                                                                )
                                                                            }
                                                                        >
                                                                            Reply
                                                                        </button>
                                                                        <span
                                                                            className={
                                                                                styles.timeCmt
                                                                            }
                                                                        >
                                                                            {
                                                                                timeElapsed
                                                                            }
                                                                        </span>
                                                                        {userInfo.email ===
                                                                            cmt.userEmail && (
                                                                            <div className="text-right">
                                                                                <Menu
                                                                                    as="div"
                                                                                    className="relative inline-block text-left"
                                                                                >
                                                                                    <div>
                                                                                        <Menu.Button className="inline-flex w-full justify-center rounded-md bg-white px-0.5 text-sm font-medium text-gray-700 ">
                                                                                            ...
                                                                                        </Menu.Button>
                                                                                    </div>
                                                                                    <Transition
                                                                                        as={
                                                                                            Fragment
                                                                                        }
                                                                                        enter="transition ease-out duration-100"
                                                                                        enterFrom="transform opacity-0 scale-95"
                                                                                        enterTo="transform opacity-100 scale-100"
                                                                                        leave="transition ease-in duration-75"
                                                                                        leaveFrom="transform opacity-100 scale-100"
                                                                                        leaveTo="transform opacity-0 scale-95"
                                                                                    >
                                                                                        <Menu.Items className="absolute right-0 w-28 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                                                                                            <Menu.Item>
                                                                                                {({
                                                                                                    active,
                                                                                                }) => (
                                                                                                    <button
                                                                                                        onClick={() =>
                                                                                                            handleRemoveComment(
                                                                                                                cmt.id
                                                                                                            )
                                                                                                        }
                                                                                                        className={`${
                                                                                                            active
                                                                                                                ? "bg-gray-100 "
                                                                                                                : "text-gray-900"
                                                                                                        } group flex w-full  items-center rounded-md pl-2 pr-5 py-2 text-xs color-delete`}
                                                                                                    >
                                                                                                        <svg
                                                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                                                            viewBox="0 0 16 16"
                                                                                                            fill="currentColor"
                                                                                                            className="w-4 h-4 mr-1.5"
                                                                                                        >
                                                                                                            <path
                                                                                                                fillRule="evenodd"
                                                                                                                d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z"
                                                                                                                clipRule="evenodd"
                                                                                                            />
                                                                                                        </svg>
                                                                                                        <div className="mt-0.5 font-medium">
                                                                                                            Delete
                                                                                                        </div>
                                                                                                    </button>
                                                                                                )}
                                                                                            </Menu.Item>
                                                                                        </Menu.Items>
                                                                                    </Transition>
                                                                                </Menu>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* //!NOTE ------------------VIEWALL------------------ */}
                                                        <div
                                                            className={clsx(
                                                                styles.viewAll,
                                                                {
                                                                    showFlex:
                                                                        totalSubComment !==
                                                                            0 &&
                                                                        listViewSubComment &&
                                                                        !listViewSubComment.includes(
                                                                            cmt.id
                                                                        ),
                                                                }
                                                            )}
                                                            onClick={() =>
                                                                handleViewSubComment(
                                                                    cmt
                                                                )
                                                            }
                                                        >
                                                            View{" "}
                                                            {totalSubComment}{" "}
                                                            reply to the comment
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 16 16"
                                                                fill="currentColor"
                                                                className="w-4 h-4"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                styles.viewAll,
                                                                {
                                                                    showFlex:
                                                                        totalSubComment !==
                                                                            0 &&
                                                                        listViewSubComment &&
                                                                        listViewSubComment.includes(
                                                                            cmt.id
                                                                        ),
                                                                }
                                                            )}
                                                            onClick={() =>
                                                                handleHideSubCmt(
                                                                    cmt
                                                                )
                                                            }
                                                        >
                                                            Hide reply to the
                                                            comment
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                viewBox="0 0 16 16"
                                                                fill="currentColor"
                                                                className="w-4 h-4"
                                                            >
                                                                <path
                                                                    fillRule="evenodd"
                                                                    d="M11.78 9.78a.75.75 0 0 1-1.06 0L8 7.06 5.28 9.78a.75.75 0 0 1-1.06-1.06l3.25-3.25a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06Z"
                                                                    clipRule="evenodd"
                                                                />
                                                            </svg>
                                                        </div>
                                                        {/* //!NOTE ------------------VIEWALL------------------ */}

                                                        {subComments &&
                                                            subComments.map(
                                                                (
                                                                    sComment,
                                                                    ind
                                                                ) => {
                                                                    const now =
                                                                        moment();
                                                                    const then =
                                                                        moment(
                                                                            sComment.date
                                                                        );
                                                                    const diffInSeconds =
                                                                        now.diff(
                                                                            then,
                                                                            "seconds"
                                                                        );
                                                                    const diffInMinutes =
                                                                        now.diff(
                                                                            then,
                                                                            "minutes"
                                                                        );
                                                                    const diffInHours =
                                                                        now.diff(
                                                                            then,
                                                                            "hours"
                                                                        );
                                                                    const diffInDays =
                                                                        now.diff(
                                                                            then,
                                                                            "days"
                                                                        );
                                                                    const diffInWeeks =
                                                                        now.diff(
                                                                            then,
                                                                            "weeks"
                                                                        );
                                                                    const diffInMonths =
                                                                        now.diff(
                                                                            then,
                                                                            "months"
                                                                        );
                                                                    const diffInYears =
                                                                        now.diff(
                                                                            then,
                                                                            "years"
                                                                        );

                                                                    let timeElapsed;
                                                                    if (
                                                                        diffInYears >
                                                                        0
                                                                    ) {
                                                                        timeElapsed = `${diffInYears} year`;
                                                                    } else if (
                                                                        diffInMonths >
                                                                        0
                                                                    ) {
                                                                        timeElapsed = `${diffInMonths} month`;
                                                                    } else if (
                                                                        diffInWeeks >
                                                                        0
                                                                    ) {
                                                                        timeElapsed = `${diffInWeeks} week`;
                                                                    } else if (
                                                                        diffInDays >
                                                                        0
                                                                    ) {
                                                                        timeElapsed = `${diffInDays} day`;
                                                                    } else if (
                                                                        diffInHours >
                                                                        0
                                                                    ) {
                                                                        timeElapsed = `${diffInHours} hour`;
                                                                    } else if (
                                                                        diffInMinutes >
                                                                        0
                                                                    ) {
                                                                        timeElapsed = `${diffInMinutes} minute`;
                                                                    } else {
                                                                        timeElapsed = `${diffInSeconds} second`;
                                                                    }

                                                                    return (
                                                                        <div
                                                                            key={
                                                                                ind +
                                                                                "sub"
                                                                            }
                                                                            className={clsx(
                                                                                styles.cmtItem,
                                                                                styles.subCmtWrap,
                                                                                "flex flex-col",
                                                                                {
                                                                                    show: listViewSubComment.includes(
                                                                                        cmt.id
                                                                                    ),
                                                                                }
                                                                            )}
                                                                        >
                                                                            <div
                                                                                className={clsx(
                                                                                    styles.cmt,
                                                                                    "flex"
                                                                                )}
                                                                            >
                                                                                <img
                                                                                    src={
                                                                                        sComment.avatar ||
                                                                                        avatar
                                                                                    }
                                                                                    alt=""
                                                                                />
                                                                                <div
                                                                                    className={clsx(
                                                                                        styles.cmtContent,
                                                                                        "flex-1"
                                                                                    )}
                                                                                >
                                                                                    <div
                                                                                        className={clsx(
                                                                                            styles.wrap
                                                                                        )}
                                                                                    >
                                                                                        <span className="text-xs">
                                                                                            {
                                                                                                sComment.userName
                                                                                            }
                                                                                        </span>
                                                                                        <div
                                                                                            className={clsx(
                                                                                                styles.content
                                                                                            )}
                                                                                        >
                                                                                            <span className="pr-1">
                                                                                                @
                                                                                                {
                                                                                                    sComment.replyToUserName
                                                                                                }
                                                                                            </span>
                                                                                            {
                                                                                                sComment.content
                                                                                            }
                                                                                        </div>
                                                                                    </div>
                                                                                    <div
                                                                                        className={clsx(
                                                                                            "mt-2"
                                                                                        )}
                                                                                    >
                                                                                        <button
                                                                                            className={
                                                                                                styles.actionsCmt
                                                                                            }
                                                                                            type="button"
                                                                                            onClick={(
                                                                                                e
                                                                                            ) =>
                                                                                                handleReply(
                                                                                                    e,
                                                                                                    sComment
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Reply
                                                                                        </button>
                                                                                        <span
                                                                                            className={
                                                                                                styles.timeCmt
                                                                                            }
                                                                                        >
                                                                                            {
                                                                                                timeElapsed
                                                                                            }
                                                                                        </span>
                                                                                        <div
                                                                                            className={clsx(
                                                                                                styles.moreAction
                                                                                            )}
                                                                                        ></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* //!NOTE ------------------REPLYBOX------------------ */}
                                                                            <div
                                                                                className={clsx(
                                                                                    styles.replyBox,
                                                                                    {
                                                                                        show:
                                                                                            showReplyBox ===
                                                                                            sComment.id,
                                                                                    }
                                                                                )}
                                                                            >
                                                                                <div className="lex flex-col flex-none">
                                                                                    <div
                                                                                        className={clsx(
                                                                                            styles.cmt,
                                                                                            "flex"
                                                                                        )}
                                                                                    >
                                                                                        <img
                                                                                            src={
                                                                                                comment.avatar ||
                                                                                                avatar
                                                                                            }
                                                                                            alt=""
                                                                                        />
                                                                                        <div
                                                                                            className={clsx(
                                                                                                styles.boxInput,
                                                                                                "flex-1"
                                                                                            )}
                                                                                        >
                                                                                            <textarea
                                                                                                value={
                                                                                                    subComment.content
                                                                                                }
                                                                                                onChange={(
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
                                                                                                className={clsx(
                                                                                                    styles.input,
                                                                                                    "w-full"
                                                                                                )}
                                                                                                type="text"
                                                                                                placeholder="Do you have any questions about this lesson?"
                                                                                            />
                                                                                            <button
                                                                                                type="button"
                                                                                                onClick={() =>
                                                                                                    handleSendComment(
                                                                                                        true
                                                                                                    )
                                                                                                }
                                                                                                className={clsx(
                                                                                                    styles.btnSend,
                                                                                                    "text-sm self-end flex-grow-0"
                                                                                                )}
                                                                                            >
                                                                                                Send
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {/* //!NOTE ------------------REPLYBOX------------------ */}
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        {/* //!NOTE ------------------REPLYBOX------------------ */}
                                                        <div
                                                            className={clsx(
                                                                styles.replyBox,
                                                                {
                                                                    show:
                                                                        showReplyBox ===
                                                                        cmt.id,
                                                                }
                                                            )}
                                                        >
                                                            <div className="lex flex-col flex-none">
                                                                <div
                                                                    className={clsx(
                                                                        styles.cmt,
                                                                        "flex"
                                                                    )}
                                                                >
                                                                    <img
                                                                        src={
                                                                            comment.avatar ||
                                                                            avatar
                                                                        }
                                                                        alt=""
                                                                    />
                                                                    <div
                                                                        className={clsx(
                                                                            styles.boxInput,
                                                                            "flex-1"
                                                                        )}
                                                                    >
                                                                        <textarea
                                                                            value={
                                                                                subComment.content
                                                                            }
                                                                            onChange={(
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
                                                                            className={clsx(
                                                                                styles.input,
                                                                                "w-full"
                                                                            )}
                                                                            type="text"
                                                                            placeholder="Do you have any questions about this lesson?"
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleSendComment(
                                                                                    true
                                                                                )
                                                                            }
                                                                            className={clsx(
                                                                                styles.btnSend,
                                                                                "text-sm self-end flex-grow-0"
                                                                            )}
                                                                        >
                                                                            Send
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* //!NOTE ------------------REPLYBOX------------------ */}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                    {quantityComment.size < totalComment && (
                                        <div
                                            className="font-medium text-sm mt-3 cursor-pointer hover:opacity-75 p-1"
                                            onClick={handleShowMoreComment}
                                        >
                                            See more comments
                                        </div>
                                    )}

                                    <div className="mt-8">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={funcCloseModal}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
