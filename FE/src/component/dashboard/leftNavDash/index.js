import Ink from "react-ink";
import { Button } from "@nextui-org/button";
import styles from "./LeftNavDash.module.scss";
import clsx from "clsx";
import appDash from "../../../assets/images/app_dash.svg";
import icCourse from "../../../assets/images/icCourse.svg";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import navSlice from "../../../redux/reducers/navSlice";

const SubItem = ({ path, title, isSelect }) => {
    var name = "List";
    if (title === 1) {
        name = "Create";
    } else if (title === 2) {
        name = "HIstory Delete";
    }
    return (
        <Button className={clsx(styles.button, "bg-white w-full")}>
            <Link className={clsx(styles.subItem)} to={path}>
                <li className="d-flex">
                    <span className={clsx(styles.dotItem)}></span>
                    <span className={clsx(styles.text)}>{name}</span>
                </li>
            </Link>
        </Button>
    );
};

function LeftNavDash() {
    const [close, setClose] = useState(false);
    const [listOpen, setListOpen] = useState([]);
    const [handleApp, setHandleApp] = useState(false);
    const navShow = useSelector((state) => state.nav.adminShow);
    const dispatch = useDispatch();

    const handleOnSub = (e) => {
        const id = e.currentTarget.id;
        if (listOpen.includes(id)) {
            setListOpen((prev) => prev.filter((item) => item !== id));
        } else {
            setListOpen([...listOpen, id]);
        }
    };

    return (
        <div
            className={clsx(
                "border-[#e9ecee] border-r-1 transition-all h-full max-sm:fixed md:fixed z-header bg-white",
                {
                    [styles.close]: !navShow,
                    "w-[74px]": !navShow,
                    "w-[220px]": navShow,
                }
            )}
        >
            <div
                className={clsx(styles.btnClose, "b-shadow")}
                onClick={() => dispatch(navSlice.actions.toggleAdminShow())}
            >
                {navShow && <ChevronLeftIcon></ChevronLeftIcon>}
                {!navShow && <ChevronRightIcon></ChevronRightIcon>}
            </div>
            <nav className={clsx(styles.container)}>
                <div className={clsx(styles.sectionNav)}>
                    <li
                        className={clsx(styles.title, {
                            [styles.close]: !navShow,
                        })}
                    >
                        OVERVIEW
                    </li>

                    <Link
                        onClick={() =>
                            setListOpen((prev) => {
                                if (listOpen.includes("APP")) {
                                    return [...prev.filter((i) => i !== "APP")];
                                } else return [...prev, "APP"];
                            })
                        }
                        className={clsx(
                            "relative flex items-center h-12 rounded-lg",
                            {
                                "text-[#0aab75]": listOpen.includes("APP"),
                                "text-[#677785]": !listOpen.includes("APP"),
                                "px-2": !navShow,
                                "px-6": navShow,
                            }
                        )}
                        to="/admin"
                    >
                        <Ink></Ink>
                        <span className={clsx(styles.icon)}>
                            <img src={appDash} alt="" />
                        </span>
                        <span
                            className={clsx(styles.nameAction, styles.label, {
                                "text-[#00a76f]": handleApp,
                            })}
                        >
                            App
                        </span>
                    </Link>
                </div>
                <div className={clsx(styles.sectionNav)}>
                    <li
                        className={clsx(styles.title, {
                            [styles.close]: !navShow,
                        })}
                    >
                        Manager
                    </li>
                    <div className={clsx(styles.listItem)}>
                        <li
                            id="userLink"
                            className={clsx(
                                styles.actionLink,
                                "w-full relative",
                                {
                                    "px-2": !navShow,
                                    "px-6": navShow,
                                    [styles.active]:
                                        listOpen.includes("userLink"),
                                }
                            )}
                            onClick={handleOnSub}
                        >
                            <Ink></Ink>
                            <span className={clsx(styles.icon)}>
                                {listOpen.includes("userLink") ? (
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="#00a76f"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            opacity="0.32"
                                            d="M2.28099 19.6575C2.36966 20.5161 2.93261 21.1957 3.77688 21.3755C5.1095 21.6592 7.6216 22 12 22C16.3784 22 18.8905 21.6592 20.2232 21.3755C21.0674 21.1957 21.6303 20.5161 21.719 19.6575C21.8505 18.3844 22 16.0469 22 12C22 7.95305 21.8505 5.6156 21.719 4.34251C21.6303 3.48389 21.0674 2.80424 20.2231 2.62451C18.8905 2.34081 16.3784 2 12 2C7.6216 2 5.1095 2.34081 3.77688 2.62451C2.93261 2.80424 2.36966 3.48389 2.28099 4.34251C2.14952 5.6156 2 7.95305 2 12C2 16.0469 2.14952 18.3844 2.28099 19.6575Z"
                                            fill="rgb(99, 115, 129)"
                                        />
                                        <path
                                            d="M13.9382 13.8559C15.263 13.1583 16.1663 11.7679 16.1663 10.1666C16.1663 7.8655 14.3008 6 11.9996 6C9.69841 6 7.83291 7.8655 7.83291 10.1666C7.83291 11.768 8.73626 13.1584 10.0612 13.856C8.28691 14.532 6.93216 16.1092 6.51251 18.0529C6.45446 18.3219 6.60246 18.5981 6.87341 18.6471C7.84581 18.8231 9.45616 19 12.0006 19C14.545 19 16.1554 18.8231 17.1278 18.6471C17.3977 18.5983 17.5454 18.3231 17.4876 18.0551C17.0685 16.1103 15.7133 14.5321 13.9382 13.8559Z"
                                            fill="rgb(99, 115, 129)"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            opacity="0.32"
                                            d="M2.28099 19.6575C2.36966 20.5161 2.93261 21.1957 3.77688 21.3755C5.1095 21.6592 7.6216 22 12 22C16.3784 22 18.8905 21.6592 20.2232 21.3755C21.0674 21.1957 21.6303 20.5161 21.719 19.6575C21.8505 18.3844 22 16.0469 22 12C22 7.95305 21.8505 5.6156 21.719 4.34251C21.6303 3.48389 21.0674 2.80424 20.2231 2.62451C18.8905 2.34081 16.3784 2 12 2C7.6216 2 5.1095 2.34081 3.77688 2.62451C2.93261 2.80424 2.36966 3.48389 2.28099 4.34251C2.14952 5.6156 2 7.95305 2 12C2 16.0469 2.14952 18.3844 2.28099 19.6575Z"
                                            fill="rgb(99, 115, 129)"
                                        />
                                        <path
                                            d="M13.9382 13.8559C15.263 13.1583 16.1663 11.7679 16.1663 10.1666C16.1663 7.8655 14.3008 6 11.9996 6C9.69841 6 7.83291 7.8655 7.83291 10.1666C7.83291 11.768 8.73626 13.1584 10.0612 13.856C8.28691 14.532 6.93216 16.1092 6.51251 18.0529C6.45446 18.3219 6.60246 18.5981 6.87341 18.6471C7.84581 18.8231 9.45616 19 12.0006 19C14.545 19 16.1554 18.8231 17.1278 18.6471C17.3977 18.5983 17.5454 18.3231 17.4876 18.0551C17.0685 16.1103 15.7133 14.5321 13.9382 13.8559Z"
                                            fill="rgb(99, 115, 129)"
                                        />
                                    </svg>
                                )}
                            </span>
                            <span
                                className={clsx(
                                    styles.nameAction,
                                    styles.label
                                )}
                            >
                                User
                            </span>
                            {listOpen.includes("userLink") ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#00a76f"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            )}
                        </li>
                        {listOpen.includes("userLink") && (
                            <div
                                id="subUser"
                                className={clsx(styles.subContent, {
                                    "d-block": navShow,
                                })}
                            >
                                <ul>
                                    <SubItem
                                        path={"/admin/user/list"}
                                    ></SubItem>
                                    <SubItem
                                        title={1}
                                        path={"/admin/user/create"}
                                    ></SubItem>

                                    <SubItem
                                        title={2}
                                        path={"/admin/user/historyDelete"}
                                    ></SubItem>
                                </ul>
                            </div>
                        )}
                        <li
                            id="postLink"
                            className={clsx(styles.actionLink, "relative", {
                                "px-2": !navShow,
                                "px-6": navShow,
                                [styles.active]: listOpen.includes("postLink"),
                            })}
                            onClick={handleOnSub}
                        >
                            <Ink></Ink>
                            <span className={clsx(styles.icon)}>
                                <svg
                                    fill="none"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                    />
                                </svg>
                            </span>
                            <span
                                className={clsx(
                                    styles.nameAction,
                                    styles.label
                                )}
                            >
                                Post
                            </span>
                            {listOpen.includes("postLink") ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#00a76f"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            )}
                        </li>
                        {listOpen.includes("postLink") && (
                            <div
                                id="subPost"
                                className={clsx(styles.subContent, {
                                    "d-block": navShow,
                                })}
                            >
                                <ul className={clsx(styles.subList)}>
                                    <SubItem
                                        path={"/admin/post/list"}
                                    ></SubItem>
                                </ul>
                            </div>
                        )}

                        <li
                            onClick={handleOnSub}
                            id="courseLink"
                            className={clsx(styles.actionLink, "relative", {
                                "px-2": !navShow,
                                "px-6": navShow,
                                [styles.active]:
                                    listOpen.includes("courseLink"),
                            })}
                        >
                            <Ink></Ink>
                            <span className={clsx(styles.icon)}>
                                <img className="ml-0.5" src={icCourse} alt="" />
                            </span>
                            <span
                                className={clsx(
                                    styles.nameAction,
                                    styles.label
                                )}
                            >
                                Course
                            </span>
                            {listOpen.includes("courseLink") ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#00a76f"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            )}
                        </li>
                        {listOpen.includes("courseLink") && (
                            <div
                                id="subCourse"
                                className={clsx(styles.subContent, {
                                    "d-block": navShow,
                                })}
                            >
                                <ul className={clsx(styles.subList)}>
                                    <SubItem
                                        path={"/admin/course/list"}
                                    ></SubItem>
                                    <SubItem
                                        title={1}
                                        path={"/admin/course/create"}
                                    ></SubItem>

                                    <SubItem
                                        title={2}
                                        path={"/admin/course/historyDelete"}
                                    ></SubItem>
                                </ul>
                            </div>
                        )}

                        <li
                            id="categoryLink"
                            className={clsx(styles.actionLink, "relative", {
                                "px-2": !navShow,
                                "px-6": navShow,
                                [styles.active]:
                                    listOpen.includes("categoryLink"),
                            })}
                            onClick={handleOnSub}
                        >
                            <Ink></Ink>
                            <span className={clsx(styles.icon)}>
                                <svg
                                    className="transform-none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 -960 960 960"
                                    width="24"
                                    fill="#768490"
                                >
                                    <path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
                                </svg>
                            </span>
                            <span
                                className={clsx(
                                    styles.nameAction,
                                    styles.label
                                )}
                            >
                                Category
                            </span>
                            {listOpen.includes("categoryLink") ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#00a76f"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            )}
                        </li>
                        {listOpen.includes("categoryLink") && (
                            <div
                                id="subCategory"
                                className={clsx(styles.subContent, {
                                    "d-block": navShow,
                                })}
                            >
                                <ul className={clsx(styles.subList)}>
                                    <SubItem
                                        path={"/admin/category/list"}
                                    ></SubItem>
                                    <SubItem
                                        title={1}
                                        path={"/admin/category/create"}
                                    ></SubItem>

                                    <SubItem
                                        title={2}
                                        path={"/admin/category/historyDelete"}
                                    ></SubItem>
                                </ul>
                            </div>
                        )}
                        <li
                            id="invoiceLink"
                            className={clsx(
                                styles.actionLink,
                                "relative",
                                {
                                    "px-2": !navShow,
                                    "px-6": navShow,
                                    [styles.active]:
                                        listOpen.includes("invoiceLink"),
                                }
                            )}
                            onClick={handleOnSub}
                        >
                            <Ink></Ink>
                            <span className={clsx(styles.icon)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="#768490"
                                    className="w-6 h-6"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M1 3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3Zm9 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-6.25-.75a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM11.5 6A.75.75 0 1 1 13 6a.75.75 0 0 1-1.5 0Z"
                                        clipRule="evenodd"
                                    />
                                    <path d="M13 11.75a.75.75 0 0 0-1.5 0v.179c0 .15-.138.28-.306.255A65.277 65.277 0 0 0 1.75 11.5a.75.75 0 0 0 0 1.5c3.135 0 6.215.228 9.227.668A1.764 1.764 0 0 0 13 11.928v-.178Z" />
                                </svg>
                            </span>
                            <span
                                className={clsx(
                                    styles.nameAction,
                                    styles.label
                                )}
                            >
                                Invoice
                            </span>
                            {listOpen.includes("invoiceLink") ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="#00a76f"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                    role="img"
                                    className="arrow MuiBox-root css-3o0h5k iconify iconify--eva"
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M10 19a1 1 0 0 1-.64-.23a1 1 0 0 1-.13-1.41L13.71 12L9.39 6.63a1 1 0 0 1 .15-1.41a1 1 0 0 1 1.46.15l4.83 6a1 1 0 0 1 0 1.27l-5 6A1 1 0 0 1 10 19"
                                    ></path>
                                </svg>
                            )}
                        </li>
                        {listOpen.includes("invoiceLink") && (
                            <div
                                id="subInvoice"
                                className={clsx(styles.subContent, {
                                    "d-block": navShow,
                                })}
                            >
                                <ul className={clsx(styles.subList)}>
                                    <SubItem
                                        path={"/admin/invoice/list"}
                                    ></SubItem>
                                    <SubItem
                                        title={1}
                                        path={"/admin/invoice/create"}
                                    ></SubItem>

                                    <SubItem
                                        title={2}
                                        path={"/admin/invoice/historyDelete"}
                                    ></SubItem>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default LeftNavDash;
