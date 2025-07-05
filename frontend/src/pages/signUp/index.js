import * as React from "react";
import { useState, useEffect } from "react";
import OAuth2Form from "../../component/auth/OAuth2Form.js";
import * as authService from "../../api/apiService/authService.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import eyeSlash from "../../assets/images/eye-slash.png";
import { useDispatch, useSelector } from "react-redux";
import loginSlice from "../../redux/reducers/loginSlice.js";
import styles from "../login/Login.module.scss";
import clsx from "clsx";
export default function SignUp() {
    const [lastClickTime, setLastClickTime] = useState(0);
    const [countdown, setCountdown] = useState(0);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        code: "",
    });
    const [errors, setErrors] = useState({});
    const [code, setCode] = useState();
    const navigate = useNavigate();
    const dangLogin = useSelector((state) => state.login.isLogin);
    const dispatch = useDispatch();

    const handleGoToLogin = () => {
        if (dangLogin) return;
        dispatch(loginSlice.actions.setLogout());
        navigate("/login");
    };

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prevCount) => prevCount - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [countdown]);

    function handleInputChange(event) {
        const { name, value } = event.target;
        if (name === "email") {
            setCountdown(0);
        }
        setFormData({
            ...formData,
            [name]: value,
        });
        errors[name] = "";
        setErrors(errors);
    }

    function handleOtpButtonClick() {
        const currentTime = new Date().getTime();
        if (!isValidEmail(formData["email"])) {
            errors.email = "Please enter a valid email";
            setErrors((err) => {
                return { ...err };
            });
            return;
        }
        if (countdown === 0) {
            const fetchApi = async () => {
                toast.promise(authService.sendMail(formData["email"]), {
                    loading: "Sending mail...",
                    success: (result) => {
                        setCode(result);
                        return "Send email successfully";
                    },
                    error: (err) => {
                        return err;
                    },
                });
            };
            fetchApi();
            setLastClickTime(currentTime);
            setCountdown(60);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const errors = {};

        Object.keys(formData).forEach((key) => {
            if (!formData[key]) {
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

        if (code != document.querySelector("#code").value) {
            errors.code = "The code is invalid";
            setErrors(errors);
        }

        if (
            formData["confirmPassword"] !== "" &&
            formData["password"] !== "" &&
            formData["confirmPassword"] !== formData["password"]
        ) {
            errors.confirmPassword = "Confirm password doesn't match";
        }
        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }
        const fetchApi = async () => {
            toast.promise(authService.register({ ...formData }), {
                loading: "Loading...",
                success: () => {
                    // nhận mã 200 - ok
                    navigate("/login");
                    return "Sign up successfully";
                },
                error: "Error registering",
            });
        };
        fetchApi();
    }
    function isValidEmail(email) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
    }

    useEffect(() => {
        if (formData["email"] === "") {
            setCountdown(0);
        }
    });

    function isPasswordStrong(password) {
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
        return passwordRegex.test(password);
    }

    function handleShowPassword(e, name) {
        let passInput = document.getElementById(name);

        if (passInput.type === "password") {
            passInput.type = "text";
            e.target.src =
                "https://cdn.builder.io/api/v1/image/assets/TEMP/a8819b1cf48d19a6e95bc57cb5d373ec0162742f3cfe62b7ec31b90b0b48de06?apiKey=9349475655ee4a448868f824f5feb11d&";
        } else {
            passInput.type = "password";
            e.target.src = eyeSlash;
        }
    }

    return (
        <div className="w-full flex">
            <section className="boxShadow m-auto flex flex-col p-10 mt-10 max-w-full text-base leading-6 bg-white rounded-xl text-neutral-800 w-[540px] max-md:px-5 max-md:mt-10">
                <h2 className="text-4xl font-semibold text-center max-md:max-w-full">
                    Sign Up
                </h2>

                <form onSubmit={handleSubmit} method="post">
                    <div className="flex mt-10">
                        <div className="flex-1 mr-5">
                            <div className="text-left">
                                <label
                                    htmlFor="firstName"
                                    className="font-medium max-md:max-w-full"
                                >
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Enter your First Name"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={clsx(
                                        styles.input,
                                        `justify-center p-2.5 mt-2.5 
                                    bg-white text-sm rounded-lg  
                                    text-stone-500 max-md:max-w-full w-full outline-none`
                                    )}
                                />
                                {errors.firstName !== "" && (
                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                        {errors.firstName}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className={clsx("flex-1 ml-5")}>
                            <div className="text-left">
                                <label
                                    htmlFor="lastName"
                                    className="font-medium max-md:max-w-full"
                                >
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Enter your Last Name"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={clsx(
                                        styles.input,
                                        `justify-center p-2.5 mt-2.5 
                                    bg-white text-sm rounded-lg  
                                    text-stone-500 max-md:max-w-full w-full outline-none`
                                    )}
                                />
                                {errors.lastName && (
                                    <div className="text-red-500 mt-1 text-sm ml-1">
                                        {errors.lastName}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
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
                                "flex p-2.5 mt-2.5 bg-white text-sm rounded-lg text-stone-500 max-md:flex-wrap"
                            )}
                        >
                            <input
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
                                "flex p-2.5 mt-2.5 bg-white text-sm rounded-lg text-stone-500 max-md:flex-wrap"
                            )}
                        >
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your Password"
                                className="flex-1 bg-transparent outline-none"
                            />
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8819b1cf48d19a6e95bc57cb5d373ec0162742f3cfe62b7ec31b90b0b48de06?apiKey=9349475655ee4a448868f824f5feb11d&"
                                // src={eyeSlash}
                                alt="Eye icon"
                                className="cursor-pointer shrink-0 w-6 aspect-square"
                                onClick={(e) =>
                                    handleShowPassword(e, "password")
                                }
                            />
                        </div>

                        {errors.password && (
                            <div className="text-red-500 mt-1 text-sm ml-1">
                                {errors.password}
                            </div>
                        )}
                    </div>
                    <div className={clsx(styles.fieldForm, "text-left")}>
                        <label
                            htmlFor="confirmPassword"
                            className="font-medium max-md:max-w-full"
                        >
                            Confirm Password
                        </label>
                        <div
                            className={clsx(
                                styles.input,
                                "flex p-2.5 mt-2.5 bg-white text-sm rounded-lg text-stone-500 max-md:flex-wrap"
                            )}
                        >
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                // value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Enter your confirm Password"
                                className="flex-1 bg-transparent outline-none"
                            />
                            <img
                                loading="lazy"
                                src="https://cdn.builder.io/api/v1/image/assets/TEMP/a8819b1cf48d19a6e95bc57cb5d373ec0162742f3cfe62b7ec31b90b0b48de06?apiKey=9349475655ee4a448868f824f5feb11d&"
                                alt="Eye icon"
                                className="cursor-pointer shrink-0 w-6 aspect-square"
                                onClick={(e) =>
                                    handleShowPassword(e, "confirmPassword")
                                }
                            />
                        </div>

                        {errors.confirmPassword && (
                            <div className="text-red-500 mt-1 text-sm ml-1">
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>
                    <div className={clsx(styles.fieldForm, "text-left")}>
                        <label
                            htmlFor="code"
                            className="font-medium max-md:max-w-full"
                        >
                            Code
                        </label>
                        <div
                            className={clsx(
                                styles.input,
                                "flex mt-2.5 bg-white text-sm rounded-lg text-stone-500 max-md:flex-wrap"
                            )}
                        >
                            <input
                                type="text"
                                id="code"
                                name="code"
                                placeholder="Enter your Code"
                                className=" p-2 flex-1 bg-transparent outline-none"
                                onChange={handleInputChange}
                            />
                            <button
                                className={`px-2 py-1 m-0 rounded-md h-11 w-28 ${
                                    countdown > 0
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-black text-white"
                                }  ${
                                    formData["email"].length === 0
                                        ? "text-whit bg-gray-400"
                                        : "bg-black text-white"
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleOtpButtonClick();
                                }}
                                disabled={countdown > 0}
                            >
                                {countdown > 0 ? `${countdown}s` : "Send code"}
                            </button>
                        </div>
                    </div>
                    {errors.code && (
                        <div className="text-left text-red-500 mt-1 text-sm ml-1">
                            {errors.code}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="justify-center px-5 py-3.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-full w-full"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mb-3 flex gap-3 justify-center items-center mt-6 text-sm text-center whitespace-nowrap text-neutral-400 max-md:flex-wrap">
                    <hr className="flex-1 shrink-0 self-stretch my-auto h-px border border-solid bg-zinc-200 border-zinc-200" />
                    <span className="self-stretch">OR</span>
                    <hr className="flex-1 shrink-0 self-stretch my-auto h-px border border-solid bg-zinc-200 border-zinc-200" />
                </div>
                <OAuth2Form></OAuth2Form>
                <p className="flex gap-1.5 justify-center px-20 mt-6 text-center max-md:flex-wrap max-md:px-5">
                    <span>Already have an account?</span>{" "}
                    <button
                        onClick={handleGoToLogin}
                        type="button"
                        to="/login"
                        className="cursor-pointer font-medium underline text-neutral-800"
                    >
                        Login
                    </button>
                    <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/52e263b3f77bfff5dc120002e909b75e45aba8be06ea8bd8be14872be77d8f38?apiKey=9349475655ee4a448868f824f5feb11d&"
                        alt="Arrow icon"
                        className="shrink-0 my-auto w-5 aspect-square"
                    />
                </p>
            </section>
        </div>
    );
}
