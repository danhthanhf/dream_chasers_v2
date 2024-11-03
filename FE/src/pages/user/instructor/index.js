import { Button } from "@nextui-org/button";
import clsx from "clsx";
import { useState } from "react";
import styles from "../../../component/dashboard/leftNavDash/LeftNavDash.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import Ink from "react-ink";
import icCourse from "../../../assets/images/icCourse.svg";
import navSlice from "../../../redux/reducers/navSlice";
import { instructorMenuSelector } from "../../../redux/selector";

export function InstructorNav() {
    const [listOpen, setListOpen] = useState([]);
    const dispatch = useDispatch();
    const navShow = useSelector(instructorMenuSelector);
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
                `border-[#e9ecee] bg-custom-1 border-r-1 transition-all h-full max-sm:fixed md:fixed z-header`,
                {
                    [styles.close]: !navShow,
                    "w-[74px]": !navShow,
                    "w-[220px]": navShow,
                }
            )}
        >
            <div
                className={clsx(styles.btnClose, "b-shadow")}
                onClick={() =>
                    dispatch(navSlice.actions.toggleInstructorShow())
                }
            >
                {navShow && <ChevronLeftIcon></ChevronLeftIcon>}
                {!navShow && <ChevronRightIcon></ChevronRightIcon>}
            </div>
            <nav className={clsx(styles.container, "bg-custom-1")}>
                <div className={clsx("transition-all delay-75 ease-linear")}>
                    <li
                        className={clsx(styles.title, {
                            [styles.close]: !navShow,
                        })}
                    >
                        Manager
                    </li>
                    <div className={clsx(styles.listItem)}>
                        <li
                            onClick={handleOnSub}
                            id="courseLink"
                            className={clsx(
                                styles.actionLink,
                                "relative px-6",
                                {
                                    [styles.active]:
                                        listOpen.includes("courseLink"),
                                }
                            )}
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
                                        path={
                                            "/instructor-dashboard/course/list"
                                        }
                                    ></SubItem>
                                    <SubItem
                                        title={1}
                                        path={
                                            "/instructor-dashboard/course/create"
                                        }
                                    ></SubItem>

                                    <SubItem
                                        title={2}
                                        path={
                                            "/instructor-dashboard/course/historyDelete"
                                        }
                                    ></SubItem>
                                </ul>
                            </div>
                        )}
                        <li
                            id="invoiceLink"
                            className={clsx(
                                styles.actionLink,
                                "relative px-6",
                                {
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

function Instructor() {
    return <div>Overview</div>;
}

const SubItem = ({ path, title }) => {
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
export default Instructor;
