import styles from "./NotificationItem.module.scss";
import clsx from "clsx";
import { Popover, Transition } from "@headlessui/react";
import noDataImg from "../../assets/images/ic_noData.svg";
import { Fragment, useEffect, useRef, useState } from "react";
import avatar from "../../assets/images/avatar_25.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as notificationService from "../../api/apiService/notificationService";
import notificationSlice from "../../redux/reducers/notificationSlice";
import { getTimeElapsed } from "../../util/index";
import Ink from "react-ink";
import { notificationSelector, userSelector } from "../../redux/selector";
import websocketService from "../../service/WebsocketService";
import { toast } from "sonner";

export default function NotificationItem({ iconBtn }) {
    const user = useSelector(userSelector);
    const [type, setType] = useState("ALL");
    const isFirstRender = useRef(true);
    // const notificationInit = useState(useSelector(notificationSelector));
    const [notification, setNoti] = useState({});
    // {
    //     notifications: [],
    //     totalECurrentlements: 0,
    //      totalAllElement: 0,
    //     totalUnread: 0,
    // }
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [render, setRender] = useState(false);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res = await notificationService.getAllNotification(
                    type,
                    pagination
                );
                setNoti(res);
                dispatch(notificationSlice.actions.init(res));
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
        handleSubscribe();
        return () => {
            if (user) {
                websocketService.unsubscribe(
                    `/user/${user.email}/notification`
                );
            }
        };
    }, [pagination, type]);

    const handleSubscribe = () => {
        if (user && isFirstRender.current) {
            websocketService.subscribe(
                `/user/${user.email}/notification`,
                (message) => {
                    const data = JSON.parse(message.body);
                    toast.info("You have a new notification");
                    addNewNoti(data);
                }
            );
        }
    };

    const addNewNoti = (data) => {
        setNoti((prevNoti) => {
            // Cập nhật tổng số thông báo chưa đọc
            if (data.read === false) {
                prevNoti.totalUnread++;
            }

            // Cập nhật tổng số tất cả các phần tử
            prevNoti.totalAllElements++;

            // Thêm thông báo mới vào danh sách
            return {
                ...prevNoti,
                notifications: [data, ...prevNoti.notifications],
                totalUnread: prevNoti.totalUnread,
                totalAllElements: prevNoti.totalAllElements,
            };
        });
    };

    const updateUIAfterReadNotification = (notification) => {
        setNoti((prevNoti) => {
            let updatedNotifications = prevNoti.notifications.map((noti) => {
                if (noti.id === notification.id) {
                    return {
                        ...noti,
                        read: true,
                        createdAt: notification.createdAt,
                    };
                }
                return noti;
            });

            if (type === "UNREAD") {
                // remove read notification from list unread
                updatedNotifications = updatedNotifications.filter(
                    (noti) => !noti.read
                );
            }
            const newTotalUnread =
                prevNoti.totalUnread > 0 ? prevNoti.totalUnread - 1 : 0;

            return {
                ...prevNoti,
                notifications: updatedNotifications,
                totalUnread: newTotalUnread,
            };
        });
    };

    const handleRead = (notification) => {
        const fetchApi = async () => {
            try {
                const result = await notificationService.readNotification(
                    notification.id
                );
                updateUIAfterReadNotification(result.content);
                // dispatch(notificationSlice.actions.update(result.content));
            } catch (error) {
                console.log(error);
            }
        };
        if (!notification.read) {
            fetchApi();
        }
        var path = getPath(notification);
        navigate(path);
    };

    const handleReadAll = () => {
        if (notification.totalUnread === 0) {
            return;
        }

        const fetchApi = async () => {
            try {
                await notificationService.readAllNotifications();
                dispatch(notificationSlice.actions.readAll());
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleRemoveAllNotification = () => {
        if (notification.totalAllElements === 0) {
            return;
        }
        const fetchApi = async () => {
            try {
                await notificationService.removeAllNotifications();

                setNoti({
                    notifications: [],
                    totalCurrentElements: 0,
                    totalUnread: 0,
                    totalAllElements: 0,
                });
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleChangeType = (type) => {
        setType(type);
    };

    const getPath = (noti) => {
        let type = noti.referenceType?.toLowerCase();
        switch (type) {
            case "post":
                return (
                    "/posts/" + noti.postTitle + "?commentId=" + noti.commentId
                );
            case "course":
                let url = "/course/" + noti.courseId;

                // Kiểm tra nếu có lessonId thì thêm vào URL
                if (noti.lessonId) {
                    url += "?lessonId=" + noti.lessonId;
                }
                // Kiểm tra nếu có commentId thì thêm vào URL
                if (noti.commentId) {
                    // Nếu có lessonId, thì thêm commentId bằng dấu "&", nếu không, bắt đầu với "?"
                    url +=
                        (noti.lessonId ? "&" : "?") +
                        "commentId=" +
                        noti.commentId;
                }
                return url;
            case "add_friend":
                return "/profile/" + noti.fromUser;
                defautl: return "/";
        }
    };

    return (
        <div className="w-full max-w-sm px-1">
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button
                            onClick={() => {
                                setRender(!render);
                            }}
                            className={` text-black justify-center pt-1 items-center flex x-3 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 relative`}
                        >
                            <Ink></Ink>

                            <span className="relative">
                                <div className={clsx(styles.button)}>
                                    {iconBtn}
                                </div>
                                {notification.totalUnread > 0 && (
                                    <div className={styles.neo}>
                                        {notification.totalUnread}
                                    </div>
                                )}
                            </span>
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel
                                className={clsx(
                                    styles.wrap,
                                    "absolute md:-left-[88px] -left-1/3 z-10 mt-3 -translate-x-1/2 transform px-4 sm:px-0 "
                                )}
                            >
                                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5 bg-custom-1">
                                    <div className="relative ">
                                        <div
                                            className={clsx(
                                                styles.header,
                                                "font-semibold text-lg flex justify-between items-center"
                                            )}
                                        >
                                            <span> Notifications</span>
                                            <span
                                                onClick={handleReadAll}
                                                className=" mr-1 py-1 px-2 rounded-md hover:bg-gray-200 opacity-85 transition-all delay-75 relative ease-linear text-sm font-medium"
                                            >
                                                <Ink></Ink>
                                                Mark all as read
                                            </span>
                                        </div>
                                        <hr className="cssHr" />
                                        <div
                                            className={clsx(
                                                "px-[18px] flex py-1.5 bg-gray-200 text-xs font-medium gap-5 justify-between"
                                            )}
                                        >
                                            <div className="flex gap-2 ">
                                                <div
                                                    onClick={() =>
                                                        handleChangeType("ALL")
                                                    }
                                                    className={clsx(
                                                        "rounded-lg px-[18px] py-1.5 flex items-center gap-2",
                                                        {
                                                            "bg-white":
                                                                type === "ALL",
                                                        }
                                                    )}
                                                >
                                                    All
                                                    <div className="boxReaded">
                                                        {notification.totalAllElements ||
                                                            0}
                                                    </div>
                                                </div>
                                                <div
                                                    onClick={() =>
                                                        handleChangeType(
                                                            "UNREAD"
                                                        )
                                                    }
                                                    className={clsx(
                                                        "rounded-lg px-1.5 py-1.5 flex items-center gap-2",
                                                        {
                                                            "bg-white":
                                                                type ===
                                                                "UNREAD",
                                                        }
                                                    )}
                                                >
                                                    Unread
                                                    <div className="boxNew">
                                                        {notification.totalUnread ||
                                                            0}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center mr-2">
                                                <div
                                                    className="btnCss"
                                                    onClick={
                                                        handleRemoveAllNotification
                                                    }
                                                >
                                                    Remove All
                                                </div>
                                            </div>
                                        </div>
                                        <hr className="cssHr" />
                                        <div
                                            className={clsx(
                                                styles.boxContent,
                                                "max-sm:h-16"
                                            )}
                                        >
                                            {notification.notifications
                                                ?.length > 0 ? (
                                                notification.notifications.map(
                                                    (noti, ind) => {
                                                        return (
                                                            <div
                                                                key={ind}
                                                                onClick={() =>
                                                                    handleRead(
                                                                        noti
                                                                    )
                                                                }
                                                                className="hover:opacity-80 transition-all delay-75 ease-in-out"
                                                            >
                                                                <div
                                                                    className={clsx(
                                                                        styles.item,
                                                                        {
                                                                            [styles.unRead]:
                                                                                !noti.read,
                                                                        }
                                                                    )}
                                                                >
                                                                    <span
                                                                        className={clsx(
                                                                            "uppercase text-xs",
                                                                            {
                                                                                tagApproved:
                                                                                    noti.type.includes(
                                                                                        "APPROVED"
                                                                                    ) ||
                                                                                    noti.type.includes(
                                                                                        "PUBLISHED"
                                                                                    ) ||
                                                                                    noti.type.includes(
                                                                                        "NEW"
                                                                                    ) ||
                                                                                    noti.type.includes(
                                                                                        "ADD"
                                                                                    ),
                                                                                tagPending:
                                                                                    noti.type.includes(
                                                                                        "PENDING"
                                                                                    ) ||
                                                                                    noti.type.includes(
                                                                                        "REPLY"
                                                                                    ),
                                                                                tagRejected:
                                                                                    noti.type.includes(
                                                                                        "REJECTED"
                                                                                    ),
                                                                            }
                                                                        )}
                                                                    >
                                                                        {"#" +
                                                                            noti.type}
                                                                    </span>
                                                                    <div className="flex gap-3 mt-1.5">
                                                                        {noti.sender && (
                                                                            <img
                                                                                src={
                                                                                    noti.img ||
                                                                                    avatar
                                                                                }
                                                                                alt="avatar"
                                                                            />
                                                                        )}
                                                                        <div className="text-[14px] flex-1">
                                                                            <strong className="line-clamp-2">
                                                                                {
                                                                                    noti.title
                                                                                }
                                                                            </strong>
                                                                            <strong>
                                                                                {
                                                                                    noti.fromUser
                                                                                }
                                                                            </strong>{" "}
                                                                            <span className="lowercase">
                                                                                {
                                                                                    noti.content
                                                                                }
                                                                                {noti.reasonReject &&
                                                                                    " because " +
                                                                                        noti.reasonReject}

                                                                                .
                                                                            </span>
                                                                            <div className="text-gray-500 mt-1.5 text-[13px] font-normal">
                                                                                {new Date(
                                                                                    noti.createdAt
                                                                                ).toLocaleDateString()}
                                                                                <span className="mx-1.5">
                                                                                    -
                                                                                </span>
                                                                                {getTimeElapsed(
                                                                                    noti.createdAt
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                        {!noti.read && (
                                                                            <div className="dotNew"></div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <hr className="cssHr" />
                                                            </div>
                                                        );
                                                    }
                                                )
                                            ) : (
                                                <div className="flex flex-col items-center py-4">
                                                    <div>
                                                        <img
                                                            src={noDataImg}
                                                            alt="No Data"
                                                        />
                                                    </div>
                                                    <span className="font-bold text-gray-500">
                                                        No Notification
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {notification.totalCurrentElements >
                                        notification.notifications?.length && (
                                        <div
                                            onClick={() =>
                                                setPagination((prev) => ({
                                                    ...prev,
                                                    size: (pagination.size +=
                                                        pagination.size),
                                                }))
                                            }
                                            className="w-full py-2 center"
                                        >
                                            <span className="relative hover:opacity-80 cursor-pointer hover:underline font-semibold px-4 py-1 rounded-md">
                                                Show more notifications
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
}
