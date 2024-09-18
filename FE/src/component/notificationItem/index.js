import styles from "./NotificationItem.module.scss";
import clsx from "clsx";
import { Popover, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import avatar from "../../assets/images/avatar_25.jpg";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import * as userApi from "../../api/apiService/authService";
import notificationSlice from "../../redux/reducers/notificationSlice";
export default function NotificationItem({ iconBtn }) {
    const user = useSelector((state) => state.login.user);

    const notifications = useSelector(
        (state) => state.notification.notifications
    );
    const [totalUnRead, setTotalUnRead] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        let total = 0;
        notifications.forEach((noti) => {
            if (!noti.read) {
                total += 1;
            }
        });
        setTotalUnRead((prev) => total);
    }, [notifications]);

    const handleRead = (notification) => {
        const fetchApi = async () => {
            try {
                const result = await userApi.readNotification(
                    user.email,
                    notification.id
                );
                dispatch(notificationSlice.actions.update(result.content));
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
        navigate(notification.path);
    };

    const handleReadAll = () => {
        if (totalUnRead === 0) {
            return;
        }

        const fetchApi = async () => {
            try {
                const result = await userApi.readAllNotifications(user.email);
                dispatch(
                    notificationSlice.actions.init(result.content.content)
                );
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleRemoveAllNotification = () => {
        const fetchApi = async () => {
            try {
                const result = await userApi.removeAllNotifications(user.email);
                dispatch(notificationSlice.actions.removeAll(result.content));
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    return (
        <div className="w-full max-w-sm px-1">
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button
                            className={`
              text-black  items-center group inline-flex x-3 text-base font-medium hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75`}
                        >
                            <span className="relative">
                                <div className={clsx(styles.button)}>
                                    {iconBtn}
                                </div>
                                {totalUnRead > 0 && (
                                    <div className={styles.neo}>
                                        {totalUnRead}
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
                                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black/5">
                                    <div className="relative bg-white ">
                                        <div
                                            className={clsx(
                                                styles.header,
                                                "font-semibold text-lg flex justify-between items-center"
                                            )}
                                        >
                                            <span> Notifications</span>
                                            <span
                                                onClick={handleReadAll}
                                                className=" mr-1 p-1 hover:opacity-80 text-xs font-medium"
                                            >
                                                Mark all as read
                                            </span>
                                        </div>
                                        <hr className="cssHr" />
                                        <div
                                            className={clsx(
                                                styles.header,
                                                "flex py-1.5  text-xs font-medium gap-4 justify-between"
                                            )}
                                        >
                                            <div className="flex gap-2">
                                                <div className="flex items-center gap-2">
                                                    All
                                                    <div className="boxReaded">
                                                        {notifications.length}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    Unread
                                                    <div className="boxNew">
                                                        {totalUnRead}
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
                                            {notifications &&
                                                notifications.map(
                                                    (noti, ind) => {
                                                        const time = moment(
                                                            noti.date
                                                        ).fromNow();
                                                        return (
                                                            <div key={ind}>
                                                                <div
                                                                    className={clsx(
                                                                        styles.item,
                                                                        "flex gap-3",
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
                                                                    <img
                                                                        src={
                                                                            noti.img ||
                                                                            avatar
                                                                        }
                                                                        alt="avatar"
                                                                    />
                                                                    <div className="text-xs flex-1">
                                                                        <strong>
                                                                            {
                                                                                noti.fromUser
                                                                            }
                                                                        </strong>{" "}
                                                                        {
                                                                            noti.content
                                                                        }
                                                                        <div className="time font-medium mt-1">
                                                                            {
                                                                                time
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    {/* {noti.read ? (
                                                                        <div className="dotReaded"></div>
                                                                    ) : (
                                                                        <div className="dotNew"></div>
                                                                    )} */}
                                                                    {!noti.read && (
                                                                        <div className="dotNew"></div>
                                                                    )}
                                                                </div>
                                                                <hr className="cssHr" />
                                                            </div>
                                                        );
                                                    }
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
