import styles from "./LeftNavDash.module.scss";
import clsx from "clsx";
import appDash from "../../../assets/images/app_dash.svg";
import icUser from "../../../assets/images/ic_user.svg";
import icCourse from "../../../assets/images/icCourse.svg";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useSelector } from "react-redux";
import { adminMenuSelector } from "../../../redux/selector";

function LeftNavDash() {
    const [close, setClose] = useState(false);
    const [listOpen, setListOpen] = useState([]);
    const showMenu = useSelector(adminMenuSelector);

    const handleOnSub = (e) => {
        const id = e.currentTarget.id;
        if (listOpen.includes(id)) {
            setListOpen((prev) => prev.filter((item) => item !== id));
        } else {
            setListOpen([...listOpen, id]);
        }
    };
    const subItemClickHandle = (e) => {
        var element = e.currentTarget;
        element.classList.toggle(clsx(styles.active));

        switch (element.id) {
            case "list":
                break;
            default:
                break;
        }
    };

    const handleCloseNavBar = () => {
        setClose(!close);
    };

    return (
        <div
            className={clsx(
                styles.Wrapper,
                "lg:sticky sm:fixed max-sm:fixed md:fixed lg:top-[68px] z-header sm:-left-280px",
                {
                    [styles.close]: close,
                    "sm:hidden max-sm:hidden": showMenu,
                }
            )}
        >
            <div
                className={clsx(styles.btnClose, "b-shadow")}
                onClick={handleCloseNavBar}
            >
                {!close && <ChevronLeftIcon></ChevronLeftIcon>}
                {close && <ChevronRightIcon></ChevronRightIcon>}
            </div>
            <nav className={clsx(styles.container)}>
                <div className={clsx(styles.sectionNav)}>
                    <li
                        className={clsx(styles.title, {
                            [styles.close]: close,
                        })}
                    >
                        OVERVIEW
                    </li>
                    <div className={clsx(styles.listItem)}>
                        <Link className={clsx(styles.actionLink)} to="/admin">
                            <span className={clsx(styles.icon)}>
                                <img src={appDash} alt="" />
                            </span>
                            <span
                                className={clsx(
                                    styles.nameAction,
                                    styles.label
                                )}
                            >
                                App
                            </span>
                        </Link>
                    </div>
                </div>
                <div className={clsx(styles.sectionNav)}>
                    <li
                        className={clsx(styles.title, {
                            [styles.close]: close,
                        })}
                    >
                        Manager
                    </li>
                    <div className={clsx(styles.listItem)}>
                        <div
                            id="userLink"
                            className={clsx(styles.actionLink, {
                                [styles.active]: listOpen.includes("userLink"),
                            })}
                            onClick={handleOnSub}
                        >
                            <span className={clsx(styles.icon)}>
                                <img src={icUser} alt="" />
                            </span>
                            <span
                                className={clsx(
                                    styles.nameAction,
                                    styles.label
                                )}
                            >
                                User
                            </span>
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
                        </div>
                        {listOpen.includes("userLink") && (
                            <div
                                id="subUser"
                                className={clsx(styles.subContent, {
                                    "d-block": !close,
                                })}
                            >
                                <ul className={clsx(styles.subList)}>
                                    <Link
                                        to="/admin/user/list"
                                        id="list"
                                        onClick={subItemClickHandle}
                                        className={clsx(styles.subItem)}
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                List
                                            </span>
                                        </li>
                                    </Link>

                                    <Link
                                        to="/admin/user/create"
                                        onClick={subItemClickHandle}
                                        className={clsx(styles.subItem)}
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                Create
                                            </span>
                                        </li>
                                    </Link>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/user/historyDelete"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                History Delete
                                            </span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        )}
                        <div
                            id="postLink"
                            className={clsx(styles.actionLink, {
                                [styles.active]: listOpen.includes("postLink"),
                            })}
                            onClick={handleOnSub}
                        >
                            <span className={clsx(styles.icon)}>
                                <svg
                                    dataSlot="icon"
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
                        </div>
                        {listOpen.includes("postLink") && (
                            <div
                                id="subPost"
                                className={clsx(styles.subContent, {
                                    "d-block": !close,
                                })}
                            >
                                <ul className={clsx(styles.subList)}>
                                    <Link
                                        to="/admin/post/list"
                                        id="list"
                                        onClick={subItemClickHandle}
                                        className={clsx(styles.subItem)}
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                List
                                            </span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        )}

                        <div
                            onClick={handleOnSub}
                            id="courseLink"
                            className={clsx(styles.actionLink, {
                                [styles.active]:
                                    listOpen.includes("courseLink"),
                            })}
                        >
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
                        </div>
                        {listOpen.includes("courseLink") && (
                            <div
                                id="subCourse"
                                className={clsx(styles.subContent, {
                                    "d-block": !close,
                                })}
                            >
                                <ul className={clsx(styles.subList)}>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/course/list"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                List
                                            </span>
                                        </li>
                                    </Link>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/course/create"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                Create
                                            </span>
                                        </li>
                                    </Link>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/course/historyDelete"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                History Delete
                                            </span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        )}

                        <div
                            id="categoryLink"
                            className={clsx(styles.actionLink, {
                                [styles.active]:
                                    listOpen.includes("categoryLink"),
                            })}
                            onClick={handleOnSub}
                        >
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
                        </div>
                        {listOpen.includes("categoryLink") && (
                            <div
                                id="subCategory"
                                className={clsx(styles.subContent, {
                                    "d-block": close === false,
                                })}
                            >
                                <ul className={clsx(styles.subList)}>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/category/list"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                List
                                            </span>
                                        </li>
                                    </Link>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/category/create"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                Create
                                            </span>
                                        </li>
                                    </Link>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/category/historyDelete"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                History Delete
                                            </span>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        )}
                        <div
                            id="invoiceLink"
                            className={clsx(styles.actionLink, {
                                [styles.active]:
                                    listOpen.includes("invoiceLink"),
                            })}
                            onClick={handleOnSub}
                        >
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
                        </div>
                        {listOpen.includes("invoiceLink") && (
                            <div
                                id="subInvoice"
                                className={clsx(styles.subContent, {
                                    "d-block": close === false,
                                })}
                            >
                                <ul className={clsx(styles.subList)}>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/invoice/list"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                List
                                            </span>
                                        </li>
                                    </Link>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/category/create"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                Create
                                            </span>
                                        </li>
                                    </Link>
                                    <Link
                                        className={clsx(styles.subItem)}
                                        to="/admin/invoice/historyDelete"
                                    >
                                        <li className="d-flex">
                                            <span
                                                className={clsx(styles.dotItem)}
                                            ></span>
                                            <span className={clsx(styles.text)}>
                                                History Delete
                                            </span>
                                        </li>
                                    </Link>
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
