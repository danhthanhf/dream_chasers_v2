import styles from "./NotificationItem.module.scss";
import clsx from "clsx";
import { Popover, Transition } from "@headlessui/react";
import noDataImg from "../../assets/images/ic_noData.svg";
import { Fragment, useState } from "react";
import avatar from "../../assets/images/avatar_25.jpg";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as userService from "../../api/apiService/authService";
import notificationSlice from "../../redux/reducers/notificationSlice";
import { getTimeElapsed } from "../../util/index";
import Ink from "react-ink";

export default function NotificationItem({ iconBtn }) {
    const user = useSelector((state) => state.login.user);
    const [type, setType] = useState("ALL");

    const notification = useSelector((state) => state.notification);
    const [totalUnRead, setTotalUnRead] = useState(0);
    const [pagination, setPagination] = useState({
        page: 0,
        size: 5,
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [render, setRender] = useState(false);

    const handleRead = (notification) => {
        if (notification.read) {
            return;
        }
        const fetchApi = async () => {
            try {
                const result = await userService.readNotification(
                    user.email,
                    notification.id
                );
                dispatch(notificationSlice.actions.update(result.content));
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
        var path = getPath(notification.type, notification.title);
        navigate(path);
    };

    const handleReadAll = () => {
        if (notification.totalUnread === 0) {
            return;
        }

        const fetchApi = async () => {
            try {
                await userService.readAllNotifications(user.email);
                dispatch(notificationSlice.actions.readAll());
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleRemoveAllNotification = () => {
        const fetchApi = async () => {
            try {
                await userService.removeAllNotifications(user.email);

                dispatch(notificationSlice.actions.removeAll());
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleChangeType = (type) => {
        setType(type);
        var fetchApi;
        if (type.toLowerCase() === "unread") {
            fetchApi = async () => {
                try {
                    const result = await userService.getAllUnread(
                        user.email,
                        pagination
                    );
                    dispatch(
                        notificationSlice.actions.init({
                            ...notification,
                            notifications: [...result.content],
                        })
                    );
                } catch (error) {
                    console.log(error);
                }
            };
        } else if (type.toLowerCase() === "all") {
            fetchApi = async () => {
                try {
                    const result = await userService.getAllNotification(
                        user.email,
                        pagination
                    );
                    dispatch(
                        notificationSlice.actions.init({
                            ...notification,
                            notifications: [...result.notifications],
                        })
                    );
                } catch (error) {
                    console.log(error);
                }
            };
        }
        fetchApi();
    };

    const getPath = (type, title, referenceId) => {
        type = type.toLowerCase();
        if (type.includes("post")) {
            return "/posts/" + title;
        } else if (type.includes("course")) {
            return "course/overview/" + encodeURIComponent(title);
        } else if (type.includes("comment")) {
            return referenceId
                ? "/posts/" + title + "?watch=" + referenceId
                : "/posts/" + title;
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
                                                        {
                                                            notification.totalElements
                                                        }
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
                                                        {
                                                            notification.totalUnread
                                                        }
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
                                            {notification.notifications &&
                                            notification.notifications.length >
                                                0 ? (
                                                notification.notifications.map(
                                                    (noti, ind) => {
                                                        return (
                                                            <Link
                                                                to={
                                                                    "/" +
                                                                    getPath(
                                                                        noti.type,
                                                                        noti.title
                                                                    )
                                                                }
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
                                                                    onClick={() =>
                                                                        handleRead(
                                                                            noti
                                                                        )
                                                                    }
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
                                                                                    ),
                                                                                tagPending:
                                                                                    noti.type.includes(
                                                                                        "PENDING"
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
                                                            </Link>
                                                        );
                                                    }
                                                )
                                            ) : (
                                                <div className="flex flex-col items-center">
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
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
}
