import * as React from "react";
import { useState, useEffect } from "react";
import * as authService from "../../../../api/apiService/authService.js";
import { toast } from "sonner";
import eyeSlash from "../../../../assets/images/eye-slash.png";
import styles from "../../../login/Login.module.scss";
import clsx from "clsx";

const initFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
};

export default function CreateUser() {
    const [countdown, setCountdown] = useState(0);
    const [formData, setFormData] = useState(initFormData);
    const [errors, setErrors] = useState({});

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
                success: (result) => {
                    setFormData(initFormData);
                    return "Create user successfully";
                },
                error: "Error registering",
            });
        };
        fetchApi();
    }

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
            <section className="boxShadow m-auto  flex flex-col p-10 mt-10 max-w-full text-base leading-6 bg-white rounded-xl text-neutral-800 w-[540px] max-md:px-5 max-md:mt-10">
                <h2 className="text-4xl font-semibold text-center max-md:max-w-full">
                    Create User
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
                                value={formData.confirmPassword}
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
                    <button
                        type="submit"
                        className="justify-center px-5 py-3.5 mt-5 text-sm font-medium text-center text-white bg-black rounded-lg max-md:max-w-full w-full"
                    >
                        Sign Up
                    </button>
                </form>
            </section>
        </div>
    );
}
