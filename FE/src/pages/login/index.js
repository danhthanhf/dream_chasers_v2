import React, { useState, useEffect, Fragment } from "react";
import OAuth2Form from "../../component/auth/OAuth2Form.js";
import * as authService from "../../api/apiService/authService.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import loginSlice from "../../redux/reducers/loginSlice.js";
import { useDispatch } from "react-redux";
import { Dialog, Transition } from "@headlessui/react";
import ShowPassword from "../../component/auth/ShowPassword.js";
import clsx from "clsx";
import styles from "./Login.module.scss";

export default function Login() {
    const initFormForgotData = {
        email: "",
        code: "",
        password: "",
        confirmPassword: "",
    };
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [formForgotData, setFormForgotData] = useState(initFormForgotData);
    const passwordErrorString =
        "Password must have at least 8 characters, including uppercase, normal, and special characters like #@!$...";
    const [errors, setErrors] = useState({});
    const [errorsForgot, setErrosForgot] = useState({});
    const [code, setCode] = useState();
    const [isEmailModalOpen, setEmailModalOpen] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [validEmailUser, setValidEmailUser] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleGoToSignUp = () => {
        navigate("/sign-up");
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    function handleInputChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
        errors[name] = "";
        setErrors(errors);
    }

    const handleInputForgotChange = (e) => {
        const { name, value } = e.target;
        setFormForgotData({
            ...formForgotData,
            [name]: value,
        });
        if (name === "email") {
            setCountdown(0);
        }
        errorsForgot[name] = "";
        setErrosForgot(errorsForgot);
    };

    function handleSubmit(event) {
        event.preventDefault();
        const errors = {};

        Object.keys(formData).forEach((key) => {
            if (formData[key] === "") {
                errors[key] = "This field is required.";
            }
        });

        if (!isPasswordStrong(formData.password)) {
            errors.password =
                "Password must have at least 8 characters, including uppercase, normal, and special characters like #@!$...";
        }

        if (!isValidEmail(formData.email)) {
            errors.email = "Email invalidate";
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const fetchApi = async () => {
            toast.promise(authService.login({ ...formData }), {
                loading: "Loading...",
                success: (data) => {
                    const { token, ...user } = data.content;
                    const payload = {
                        token,
                        user,
                    };
                    dispatch(loginSlice.actions.setLogin(payload));
                    const prePath = sessionStorage.getItem("prevPath");
                    prePath ? navigate(prePath) : navigate("/");
                    sessionStorage.removeItem("prevPath");
                    return "Welcome to Dream Chasers";
                },
                error: (error) => {
                    console.log(error);
                    return "Email or password invalid, please try again";
                },
            });
        };
        fetchApi();
    }

    const handleSubmitSendEmail = (e) => {
        e.preventDefault();
        const errorsForgot = {};
        if (!isValidEmail(formForgotData.email)) {
            errorsForgot.email = "Please enter a valid email";
        }

        if (Object.keys(errorsForgot).length > 0) {
            setErrosForgot(errorsForgot);
            return;
        }

        if (countdown === 0) {
        }
        const fetchApi = () => {
            toast.promise(
                authService.sendResetPasswordEmail(formForgotData.email),
                {
                    loading: "Send email...",
                    success: (res) => {
                        setCode(res);
                        return "Send email successfully";
                    },
                    error: "Email is not registered",
                }
            );
        };

        fetchApi();
        setCountdown(60);
    };

    function isValidEmail(email) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
    }

    function isPasswordStrong(password) {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        return passwordRegex.test(password);
    }

    const handleForgotPasswordClick = () => {
        setEmailModalOpen(true);
        setValidEmailUser(false);
        setCountdown(0);
        setCode(0);
        setFormForgotData(initFormForgotData);
        setErrosForgot({});
    };

    const closeModal = () => {
        setEmailModalOpen(false);
    };

    const handleForgotSubmit = () => {
        if (!validEmailUser) {
            const errors = {};
            if (formForgotData.email === "") {
                errors.email = "This field is required";
            }
            if (formForgotData.code === "") {
                errors.code = "This field is required";
            }

            if (Object.keys(errors).length > 0) {
                setErrosForgot({ ...errors });
                return;
            }

            if (code != formForgotData.code) {
                errors.code = "Invalid verification the code";
                setErrosForgot({ ...errors });
                return;
            }
            const fetchApi = () => {
                toast.promise(authService.validateCode(formForgotData), {
                    loading: "loading...",
                    success: () => {
                        setValidEmailUser(true);
                        return "Successful authentication";
                    },
                    error: "The verification code is invalid or has expired",
                });
            };
            fetchApi();
            return;
        }

        const errors = {};

        if (formForgotData.password === "") {
            errors.password = "The field is required";
        }

        if (formForgotData.confirmPassword === "") {
            errors.confirmPassword = "The field is required";
        }

        if (
            formForgotData.password !== "" &&
            !isPasswordStrong(formForgotData.password)
        ) {
            errors.password = passwordErrorString;
        }
        console.log(formForgotData.password);

        if (
            formForgotData.confirmPassword !== "" &&
            formForgotData.confirmPassword !== formForgotData.password
        ) {
            errors.confirmPassword = "Confirm password does not match";
        }

        if (Object.keys(errors).length > 0) {
            setErrosForgot({ ...errors });
            return;
        }

        const fetchApi = () => {
            toast.promise(authService.resetPassword(formForgotData), {
                loading: "Processing...",
                success: (data) => {
                    console.log(data);
                    setEmailModalOpen(false);
                    return "Your password has been reset";
                },
                error: (error) => {
                    console.log(error);
                    return "Reset password is error, please try again";
                },
            });
        };

        fetchApi();
    };

    useEffect(() => {
        dispatch(loginSlice.actions.setLogout());
    }, []);
    console.log("re-render");

    return (
        <div className="w-full flex">
            <section className="boxShadow m-auto mt-40 flex flex-col p-10 mt-10 max-w-full text-base leading-6 bg-white rounded-xl text-neutral-800 w-[540px] max-md:px-5 max-md:mt-10">
                <h2 className="text-4xl font-semibold text-center max-md:max-w-full">
                    Login
                </h2>

                <form onSubmit={handleSubmit} method="post">
                    <div className={clsx(styles.fieldForm, "text-left")}>
                        <label
                            htmlFor="email"
                            className="font-medium max-md:max-w-full"
                        >
                            Email
                        </label>
                        <div
                            className={clsx(
                                styles.input,
                                "flex p-2.5 mt-2.5 bg-gray-50 rounded-lg  text-stone-500 max-md:flex-wrap"
                            )}
                        >
                            <input
                                autoComplete="true"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your Email"
                                className="flex-1 bg-transparent outline-none"
                            />
                        </div>
                        {errors.email && (
                            <div className="text-red-500 mt-1 text-sm ml-1">
                                {errors.email}
                            </div>
                        )}
                    </div>
                    <div className={clsx(styles.fieldForm, "text-left")}>
                        <label
                            htmlFor="password"
                            className="font-medium max-md:max-w-full"
                        >
                            Password
                        </label>
                        <div
                            className={clsx(
                                styles.input,
                                "flex p-2.5 mt-2.5 bg-gray-50 rounded-lg  text-stone-500 max-md:flex-wrap"
                            )}
                        >
                            <input
                                autoComplete="true"
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your Password"
                                className="flex-1 bg-transparent outline-none"
                            />
                            <ShowPassword
                                passInput={document.getElementById("password")}
                            ></ShowPassword>
                        </div>
                        <div
                            className="text-sm cursor-pointer float-right mt-2 self-stretch relative leading-[150%] text-grey-30 text-right"
                            onClick={handleForgotPasswordClick}
                        >
                            Forgot Password?
                        </div>

                        {errors.password && (
                            <div className="mt-2 text-red-500  text-sm ml-1">
                                {errors.password}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="justify-center px-5 py-3.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-full w-full"
                    >
                        Login
                    </button>
                </form>
                <div className="mb-3 flex gap-3 justify-center items-center mt-6 text-sm text-center whitespace-nowrap text-neutral-400 max-md:flex-wrap">
                    <hr className="flex-1 shrink-0 self-stretch my-auto h-px border border-solid bg-zinc-200 border-zinc-200" />
                    <span className="self-stretch">OR</span>
                    <hr className="flex-1 shrink-0 self-stretch my-auto h-px border border-solid bg-zinc-200 border-zinc-200" />
                </div>
                <OAuth2Form></OAuth2Form>
                <p className="flex gap-1.5 justify-center px-20 mt-6 text-center max-md:flex-wrap max-md:px-5">
                    <span>Don't have an account?</span>{" "}
                    <button
                        type="button"
                        to="/sign-up"
                        className="cursor-pointer font-medium underline text-neutral-800"
                        onClick={handleGoToSignUp}
                    >
                        Sign Up
                    </button>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/52e263b3f77bfff5dc120002e909b75e45aba8be06ea8bd8be14872be77d8f38?apiKey=9349475655ee4a448868f824f5feb11d&"
                        alt="Arrow icon"
                        className="shrink-0 my-auto w-5 aspect-square"
                    />
                </p>
            </section>
            <Transition appear show={isEmailModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                                <Dialog.Panel className="z-50 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                    <form>
                                        <Dialog.Title
                                            as="h2"
                                            className="text-3xl font-semibold text-center max-md:max-w-full"
                                        >
                                            Forgot Password
                                        </Dialog.Title>
                                        {!validEmailUser && (
                                            <>
                                                {" "}
                                                <div
                                                    className={clsx(
                                                        styles.fieldForm,
                                                        "text-left"
                                                    )}
                                                >
                                                    <label
                                                        htmlFor="email"
                                                        className="font-medium max-md:max-w-full"
                                                    >
                                                        Email
                                                    </label>
                                                    <div className="flex p-2.5 mt-2.5 bg-gray-50 rounded-lg border border-gray-100 border-solid text-stone-500 max-md:flex-wrap">
                                                        <input
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            value={
                                                                formForgotData.email
                                                            }
                                                            onChange={
                                                                handleInputForgotChange
                                                            }
                                                            placeholder="Enter your Email"
                                                            className="flex-1 bg-transparent outline-none"
                                                        />
                                                    </div>
                                                    {errorsForgot.email && (
                                                        <div className="text-red-500 mt-1 text-sm ml-1">
                                                            {errorsForgot.email}
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.fieldForm,
                                                        "text-left"
                                                    )}
                                                >
                                                    <label
                                                        htmlFor="code"
                                                        className="font-medium max-md:max-w-full"
                                                    >
                                                        Code
                                                    </label>
                                                    <div className="flex mt-2.5 bg-gray-50 rounded-lg border border-gray-100 border-solid text-stone-500 max-md:flex-wrap">
                                                        <input
                                                            type="text"
                                                            id="code"
                                                            name="code"
                                                            placeholder="Enter your Code"
                                                            className=" p-2 flex-1 bg-transparent outline-none"
                                                            onChange={
                                                                handleInputForgotChange
                                                            }
                                                        />
                                                        <button
                                                            className={`px-2 py-1 m-0 rounded-md h-11 w-28 ${
                                                                countdown > 0
                                                                    ? "bg-gray-400 text-white cursor-not-allowed"
                                                                    : "bg-black text-white"
                                                            }  ${
                                                                formForgotData[
                                                                    "email"
                                                                ].length === 0
                                                                    ? "text-whit bg-gray-400"
                                                                    : "bg-black text-white"
                                                            }`}
                                                            onClick={
                                                                handleSubmitSendEmail
                                                            }
                                                            disabled={
                                                                countdown > 0
                                                            }
                                                        >
                                                            {countdown > 0
                                                                ? `${countdown}s`
                                                                : "Send code"}
                                                        </button>
                                                    </div>
                                                    {errorsForgot.code && (
                                                        <div className="text-red-500 mt-1 text-sm ml-1">
                                                            {errorsForgot.code}
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {validEmailUser && (
                                            <>
                                                <div
                                                    className={clsx(
                                                        styles.fieldForm,
                                                        "text-left"
                                                    )}
                                                >
                                                    <label
                                                        htmlFor="email"
                                                        className="font-medium max-md:max-w-full"
                                                    >
                                                        Email
                                                    </label>
                                                    <div className="cursor-not-allowed flex p-2.5 mt-2.5 bg-gray-50 rounded-lg border border-gray-100 border-solid text-stone-500 max-md:flex-wrap">
                                                        <input
                                                            disabled
                                                            type="email"
                                                            id="email"
                                                            name="email"
                                                            placeholder={
                                                                formForgotData.email
                                                            }
                                                            className="cursor-not-allowed flex-1 bg-transparent outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.fieldForm,
                                                        "text-left"
                                                    )}
                                                >
                                                    <label
                                                        htmlFor="passwordForgot"
                                                        className="font-medium max-md:max-w-full"
                                                    >
                                                        Password
                                                    </label>
                                                    <div className="flex p-2.5 mt-2.5 bg-gray-50 rounded-lg border border-gray-100 border-solid text-stone-500 max-md:flex-wrap">
                                                        <input
                                                            type="password"
                                                            id="passwordForgot"
                                                            name="password"
                                                            value={
                                                                formForgotData.password
                                                            }
                                                            onChange={
                                                                handleInputForgotChange
                                                            }
                                                            placeholder="Enter new password"
                                                            className="flex-1 bg-transparent outline-none"
                                                        />
                                                        <ShowPassword
                                                            passInput={document.getElementById(
                                                                "passwordForgot"
                                                            )}
                                                        ></ShowPassword>
                                                    </div>
                                                    {errorsForgot.password && (
                                                        <div className="text-red-500 mt-1 text-sm ml-1">
                                                            {
                                                                errorsForgot.password
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className={clsx(
                                                        styles.fieldForm,
                                                        "text-left"
                                                    )}
                                                >
                                                    <label
                                                        htmlFor="cofirmPassword"
                                                        className="font-medium max-md:max-w-full"
                                                    >
                                                        Confirm Password
                                                    </label>
                                                    <div className="flex p-2.5 mt-2.5 bg-gray-50 rounded-lg border border-gray-100 border-solid text-stone-500 max-md:flex-wrap">
                                                        <input
                                                            type="password"
                                                            id="confirmPassword"
                                                            name="confirmPassword"
                                                            placeholder="Enter confirm password"
                                                            className="flex-1 bg-transparent outline-none"
                                                            value={
                                                                formForgotData.confirmPassword
                                                            }
                                                            onChange={
                                                                handleInputForgotChange
                                                            }
                                                        />
                                                        <ShowPassword
                                                            passInput={document.getElementById(
                                                                "confirmPassword"
                                                            )}
                                                        ></ShowPassword>
                                                    </div>
                                                    {errorsForgot.confirmPassword && (
                                                        <div className="text-red-500 mt-1 text-sm ml-1">
                                                            {
                                                                errorsForgot.confirmPassword
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {/* // SUBMIT */}
                                        <div className="mt-4">
                                            <div
                                                className="cursor-pointer justify-center px-5 py-3.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-full w-full"
                                                onClick={handleForgotSubmit}
                                            >
                                                Submit
                                            </div>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
