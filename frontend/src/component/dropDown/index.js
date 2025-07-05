import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import styles from "./Menu.module.scss";
import { Fragment, useState } from "react";
import avatarDefault from "../../assets/images/avatar_25.jpg";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router-dom";
import * as authService from "../../api/apiService/authService";
import { useDispatch, useSelector } from "react-redux";
import loginSlice from "../../redux/reducers/loginSlice";
import { registerInstructor } from "../../api/apiService/userService";
import Modal from "../modal";
import { toast } from "sonner";

function Dropdown({ elementClick, ...props }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.login.user);
    const navigate = useNavigate();
    const handleSendRequest = () => {
        setModalContent({ ...modalContent, isOpen: false });
        toast.promise(registerInstructor, {
            loading: "Sending...",
            success: "Request has been sent",
            error: "Error when sending request",
        });
    };

    const [modalContent, setModalContent] = useState({
        title: "Resgister become a instructor",
        // description: "Are you sure want to become a instructor?",
        isReject: false,
        handleRemove: handleSendRequest,
        isOpen: false,
        handleCloseModal: () => {
            setModalContent({ ...modalContent, isOpen: false });
        },
    });

    const handleLogout = () => {
        const fetchApi = async () => {
            try {
                await authService.logout();
                dispatch(loginSlice.actions.setLogout());
                navigate("/");
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    };

    const handleRegisterInstructor = () => {
        setModalContent((prev) => ({ ...prev, isOpen: true }));
    };

    return (
        <div className="z-10 text-right flex items-center">
            <Menu as="div" className="relative text-left flex ml-2">
                <Menu.Button className="inline-flex items-center w-full justify-center rounded-md text-sm font-medium text-white focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75">
                    {elementClick
                        ? elementClick
                        : "Options" +
                          (
                              <ChevronDownIcon
                                  className="-mr-1 ml-2 h-5 w-5 text-violet-200 hover:text-violet-100"
                                  aria-hidden="true"
                              />
                          )}
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
                            styles.itemClick,
                            "absolute ivide-y divide-gray-100 rounded-md bg-custom-1 shadow-lg ring-1 ring-black/5 focus:outline-none max-sm:-right-1/2 max-sm:absolute max-lg:-r-20 md:-right-2  min-w-[200px]"
                        )}
                    >
                        <div className="px-2 py-1 w-max">
                            <div
                                className={`text-gray-900 group flex w-full items-center rounded-md py-2.5 text-sm`}
                            >
                                <div>
                                    <img
                                        className={clsx(styles.avatar)}
                                        src={user.avatarUrl || avatarDefault}
                                        alt=""
                                    />
                                </div>
                                <div
                                    className={clsx(
                                        styles.userName,
                                        "flex-1 font-semibold"
                                    )}
                                >
                                    <span>
                                        {user && user.firstName}
                                        {user && user.lastName}
                                    </span>
                                    <div>
                                        {user?.email?.includes("@")
                                            ? "@" +
                                              user.email.substring(
                                                  0,
                                                  user.email.indexOf("@")
                                              )
                                            : "@" + user?.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="h-px bg-gray-200" />
                        <div className="px-1 py-1 ">
                            {(user?.role === "ADMIN" ||
                                user?.role === "MANAGER") && (
                                <Link to={"/admin"}>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active
                                                        ? "bg-black text-white"
                                                        : "text-gray-900"
                                                } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                            >
                                                {active ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        id="dashboard"
                                                        className="mr-2 w-6 h-6"
                                                        fill="#fff"
                                                    >
                                                        <path d="M8.5 3h-3a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5zm0 4h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 0 3zm0 3h-3A2.5 2.5 0 0 0 3 12.5v6A2.5 2.5 0 0 0 5.5 21h3a2.5 2.5 0 0 0 2.5-2.5v-6A2.5 2.5 0 0 0 8.5 10zm1.5 8.5A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-6A1.5 1.5 0 0 1 5.5 11h3a1.5 1.5 0 0 1 1.5 1.5zm8.5-2.5h-3a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5zm0 4h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 0 3zm0-17h-3A2.5 2.5 0 0 0 13 5.5v6a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-6A2.5 2.5 0 0 0 18.5 3zm1.5 8.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 f15.5 4h3A1.5 1.5 0 0 1 20 5.5z"></path>
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        id="dashboard"
                                                        className="mr-2 w-6 h-6 "
                                                    >
                                                        <path d="M8.5 3h-3a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5zm0 4h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 0 3zm0 3h-3A2.5 2.5 0 0 0 3 12.5v6A2.5 2.5 0 0 0 5.5 21h3a2.5 2.5 0 0 0 2.5-2.5v-6A2.5 2.5 0 0 0 8.5 10zm1.5 8.5A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-6A1.5 1.5 0 0 1 5.5 11h3a1.5 1.5 0 0 1 1.5 1.5zm8.5-2.5h-3a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 0 0-5zm0 4h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 0 3zm0-17h-3A2.5 2.5 0 0 0 13 5.5v6a2.5 2.5 0 0 0 2.5 2.5h3a2.5 2.5 0 0 0 2.5-2.5v-6A2.5 2.5 0 0 0 18.5 3zm1.5 8.5a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-6A1.5 1.5 0 0 1 15.5 4h3A1.5 1.5 0 0 1 20 5.5z"></path>
                                                    </svg>
                                                )}
                                                Dashboard
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Link>
                            )}
                            <Link
                                to={`/me/profile/${
                                    user?.email?.includes("@")
                                        ? "@" +
                                          user.email.substring(
                                              0,
                                              user.email.indexOf("@")
                                          )
                                        : "@" + user?.email
                                }`}
                            >
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                            {active ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    className="mr-2 w-6 h-6"
                                                    stroke="white"
                                                >
                                                    <path d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="mr-2 w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        stroklinejoin="round"
                                                        d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                    />
                                                </svg>
                                            )}
                                            Profile
                                        </button>
                                    )}
                                </Menu.Item>
                            </Link>
                            <Link to={`/message/`}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                            {active ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="mr-2 w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="mr-2 w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                                    />
                                                </svg>
                                            )}
                                            Messages
                                        </button>
                                    )}
                                </Menu.Item>
                            </Link>
                        </div>

                        <div className="h-px bg-gray-200" />
                        <div className="px-1 py-1">
                            {
                                <Link to={"/instructor-dashboard"}>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active
                                                        ? "bg-black text-white"
                                                        : "text-gray-900"
                                                } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                            >
                                                {active ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="mr-2 w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            stroklinejoin="round"
                                                            d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="mr-2 w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            stroklinejoin="round"
                                                            d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125Z"
                                                        />
                                                    </svg>
                                                )}
                                                Instructor Dashboard
                                            </button>
                                        )}
                                    </Menu.Item>
                                </Link>
                                // :
                                /*   (
                                <div onClick={handleRegisterInstructor}>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${
                                                    active
                                                        ? "bg-black text-white"
                                                        : "text-gray-900"
                                                } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                            >
                                                {active ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="mr-2 w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth="1.5"
                                                        stroke="currentColor"
                                                        className="mr-2 w-6 h-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5"
                                                        />
                                                    </svg>
                                                )}
                                                Become a instructor
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            ) */
                            }
                            <Link to={"/me/my-learning"}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                            {active ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 100 100"
                                                    className="mr-2 w-6 h-6"
                                                    strokeWidth={2.0}
                                                    fill="#fff"
                                                >
                                                    <path d="M88 10H12c-3.31 0-6 2.69-6 6v58c0 3.31 2.69 6 6 6h30.05l-.67 1.69A6.852 6.852 0 0 1 35 86h-4c-1.1 0-2 .9-2 2s.9 2 2 2h38c1.1 0 2-.9 2-2s-.9-2-2-2h-4c-2.82 0-5.32-1.69-6.37-4.31L57.95 80H88c3.31 0 6-2.69 6-6V16c0-3.31-2.69-6-6-6zm-78 6c0-1.1.9-2 2-2h76c1.1 0 2 .9 2 2v50H10V16zm44.91 67.17c.42 1.04.98 1.99 1.66 2.83H43.43c.68-.84 1.24-1.79 1.66-2.83L46.35 80h7.29l1.27 3.17zM90 74c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2v-4h80v4z"></path>
                                                    <path d="M76 20H54c-1.54 0-2.94.59-4 1.54A5.98 5.98 0 0 0 46 20H24c-1.1 0-2 .9-2 2v30c0 1.1.9 2 2 2h22c1.1 0 2 .9 2 2s.9 2 2 2 2-.9 2-2 .9-2 2-2h7v4c0 1.1.9 2 2 2s2-.9 2-2v-4h11c1.1 0 2-.9 2-2V22c0-1.1-.9-2-2-2zM48 50.34c-.63-.22-1.3-.34-2-.34H26V24h20c1.1 0 2 .9 2 2v24.34zM74 50H54c-.7 0-1.37.12-2 .34V26c0-1.1.9-2 2-2h20v26z"></path>
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="mr-2 w-6 h-6"
                                                    viewBox="0 0 100 100"
                                                    fill="black"
                                                    strokeWidth={2.0}
                                                >
                                                    <path d="M88 10H12c-3.31 0-6 2.69-6 6v58c0 3.31 2.69 6 6 6h30.05l-.67 1.69A6.852 6.852 0 0 1 35 86h-4c-1.1 0-2 .9-2 2s.9 2 2 2h38c1.1 0 2-.9 2-2s-.9-2-2-2h-4c-2.82 0-5.32-1.69-6.37-4.31L57.95 80H88c3.31 0 6-2.69 6-6V16c0-3.31-2.69-6-6-6zm-78 6c0-1.1.9-2 2-2h76c1.1 0 2 .9 2 2v50H10V16zm44.91 67.17c.42 1.04.98 1.99 1.66 2.83H43.43c.68-.84 1.24-1.79 1.66-2.83L46.35 80h7.29l1.27 3.17zM90 74c0 1.1-.9 2-2 2H12c-1.1 0-2-.9-2-2v-4h80v4z"></path>
                                                    <path d="M76 20H54c-1.54 0-2.94.59-4 1.54A5.98 5.98 0 0 0 46 20H24c-1.1 0-2 .9-2 2v30c0 1.1.9 2 2 2h22c1.1 0 2 .9 2 2s.9 2 2 2 2-.9 2-2 .9-2 2-2h7v4c0 1.1.9 2 2 2s2-.9 2-2v-4h11c1.1 0 2-.9 2-2V22c0-1.1-.9-2-2-2zM48 50.34c-.63-.22-1.3-.34-2-.34H26V24h20c1.1 0 2 .9 2 2v24.34zM74 50H54c-.7 0-1.37.12-2 .34V26c0-1.1.9-2 2-2h20v26z"></path>
                                                </svg>
                                            )}
                                            My Learning
                                        </button>
                                    )}
                                </Menu.Item>
                            </Link>
                        </div>

                        <div className="h-px bg-gray-200" />
                        <div className="px-1 py-1 ">
                            <Link to={"/me/posts"}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                            {active ? (
                                                <svg
                                                    fill="none"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                    className="w-[22px] h-[22px] mr-2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                    ></path>
                                                </svg>
                                            ) : (
                                                <svg
                                                    fill="none"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                    className="w-[22px] h-[22px] mr-2"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                                                    ></path>
                                                </svg>
                                            )}
                                            My Post
                                        </button>
                                    )}
                                </Menu.Item>
                            </Link>
                            <Link to={"/new-post"}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                            {active ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="mr-2 w-[22px] h-[22px]"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="mr-2 w-[22px] h-[22px]"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                                    />
                                                </svg>
                                            )}
                                            Write Post
                                        </button>
                                    )}
                                </Menu.Item>
                            </Link>
                            {/* <Link to={"/me/bookmark/posts"}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                            {active ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="mr-2 w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={1.5}
                                                    stroke="currentColor"
                                                    className="mr-2 w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9"
                                                    />
                                                </svg>
                                            )}
                                            Bookmark
                                        </button>
                                    )}
                                </Menu.Item>
                            </Link> */}
                        </div>

                        <div className="h-px bg-gray-200" />
                        <div className="px-1 py-1">
                            <div onClick={handleLogout}>
                                <Menu.Item>
                                    {({ active }) => (
                                        <button
                                            className={`${
                                                active
                                                    ? "bg-black text-white"
                                                    : "text-gray-900"
                                            } group flex w-full items-center rounded-md px-2 py-2.5 text-sm`}
                                        >
                                            {active ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="mr-2 w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        stroklinejoin="round"
                                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="mr-2 w-6 h-6"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        stroklinejoin="round"
                                                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                                                    />
                                                </svg>
                                            )}
                                            Logout
                                        </button>
                                    )}
                                </Menu.Item>
                            </div>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            <Modal
                isOpen={modalContent.isOpen}
                closeModal={modalContent.handleCloseModal}
                handleRemove={modalContent.handleRemove}
                title={modalContent.title}
                isReject={modalContent.isReject}
                description={modalContent.description}
            >
                <div>
                    You are requesting to become an instructor on our platform.
                    Please review the details below before submitting your
                    request
                    <ul>
                        <li>
                            <strong>Benefit:</strong> Share your knowledge and
                            earn income by creating courses.
                        </li>
                        <li>
                            <strong>Requirement:</strong> Submit proof of
                            expertise in your field (e.g., certifications,
                            portfolio).
                        </li>
                        <li>
                            <strong>Approval Process:</strong> Your application
                            will be reviewed within 3-5 business days.
                        </li>
                    </ul>
                </div>
            </Modal>
        </div>
    );
}

export default Dropdown;
