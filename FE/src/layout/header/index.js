import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import avatar from "../../assets/images/avatar_25.jpg";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.scss";
import clsx from "clsx";
import Dropdown from "../../component/dropDown/index";
import { useDispatch, useSelector } from "react-redux";
import NotificationItem from "../../component/notificationItem";
import SearchBar from "../../component/search";

export default function Header() {
    const navigate = useNavigate();
    const [page, setPage] = React.useState("login");
    const [isAdmin, setIsAdmin] = React.useState(false);

    const { user } = useSelector((state) => state.login);

    React.useEffect(() => {
        if (window.location.pathname === "/admin") {
            setIsAdmin(true);
        }
    }, []);

    const handleGoToSignUp = () => {
        if (window.location.pathname === "/sign-up") return;
        setPage("sign-up");
        navigate("/sign-up");
    };

    const handleGoToLogin = () => {
        if (window.location.pathname === "/login") return;
        setPage("login");
        navigate("/login");
    };
    return (
        <div className="z-10 relative">
            <div className=" flex justify-center">
                <div
                    className={clsx(
                        `${styles.boxShadow} px-4 md:px-8 rounded-b-xl bg-custom z-header sm:w-full items-center fixed flex gap-5 justify-between lg:px-16 sm:px-8 py-2.5 text-sm leading-5 border-b border-gray-100 border-solid  lg:w-[1200px] `
                    )}
                >
                    <div className="flex  gap-5 justify-between self-start text-neutral-800">
                        <Link to="/">
                            <img
                                loading="lazy"
                                src={logo}
                                alt="Logo"
                                className="shrink-0 w-10 aspect-square"
                            />
                        </Link>

                        <nav className="flex gap-4 justify-between my-auto max-sm:hidden">
                            <Link className={`nav-header`} to="/">
                                Home
                            </Link>
                        </nav>
                        <nav className="flex gap-4 justify-between my-auto">
                            <Link className={`nav-header `} to="/posts">
                                Post
                            </Link>
                        </nav>
                        <div className="lg:flex xl:flex md:flex items-center  sm:hidden max-sm:hidden">
                            <SearchBar></SearchBar>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-between items-center">
                        {!user ? (
                            <>
                                <button
                                    type="button"
                                    onClick={handleGoToSignUp}
                                    id="signUp"
                                    className={`"max-sm:text-sm md:py-4 md:px-4 sm:py-2 max-sm:py-2 lg:px-6 lg:py-3 max-sm:px-2  cursor-pointer" ${
                                        page === "sign-up"
                                            ? "justify-center  whitespace-nowrap rounded-md max-md:px-5 bg-black text-white"
                                            : "my-auto text-neutral-800 whitespace-nowrap rounded-md"
                                    }`}
                                >
                                    Sign Up
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGoToLogin}
                                    id="login"
                                    className={`"max-sm:text-sm md:py-4 md:px-4 sm:py-2 lg:px-6 lg:py-3 max-sm:px-2 max-sm:py-2 cursor-pointer" ${
                                        page === "login"
                                            ? "justify-center  whitespace-nowrap rounded-md max-md:px-5 bg-black text-white"
                                            : "my-auto  text-neutral-800 whitespace-nowrap rounded-md"
                                    }`}
                                >
                                    Login
                                </button>
                            </>
                        ) : (
                            <>
                                <div
                                    className={clsx(
                                        styles.notification,
                                        "flex relative items-center"
                                    )}
                                >
                                    <NotificationItem
                                        iconBtn={
                                            <svg
                                                viewBox="0 0 448 512"
                                                className="bell"
                                            >
                                                <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"></path>
                                            </svg>
                                        }
                                    ></NotificationItem>
                                </div>
                                <Dropdown
                                    elementClick={
                                        <img
                                            className="border circle object-cover w-10 h-10 border-gray-200 cursor-pointer"
                                            src={user?.avatarUrl || avatar}
                                            alt=""
                                        />
                                    }
                                ></Dropdown>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
