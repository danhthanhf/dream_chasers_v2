import * as React from "react";
import logo from "../../assets/images/logo.png";
import { useState } from "react";
export default function Footer() {
    const [isAdminPage, setIsAdminPage] = useState(false);

    React.useEffect(() => {
        if (window.location.pathname === "/admin") {
            setIsAdminPage(true);
        }
    });
    return (
        !isAdminPage && (
            <>
                <footer className="flex flex-col self-stretch lg:px-20 max-sm:px-2  w-full bg-white max-md:px-5 max-md:mt-10 max-md:max-w-full">
                    <div className="h-px w-full bg-gray-200 mt-16 "></div>
                    <div className="justify-between max-md:max-w-full lg:pt-8 md:pt-6 pb-5">
                        <div className="flex max-lg:gap-5 max-sm:gap-1 max-md:flex-col max-md:gap-0">
                            <div className="flex flex-col w-[37%] max-md:ml-0 max-md:w-full">
                                <div className="flex flex-col grow text-base leading-6 text-neutral-800 max-md:mt-10">
                                    <img
                                        loading="lazy"
                                        src={logo}
                                        alt="Logo"
                                        className="w-11 aspect-square"
                                    />
                                    <div className="flex gap-1 mt-8 whitespace-nowrap rounded-md">
                                        <img
                                            loading="lazy"
                                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c10d0eaa45588084870aba9aa41d04635e39e271b659dd6255d77b8795a17613?apiKey=9349475655ee4a448868f824f5feb11d&"
                                            alt="Email icon"
                                            className="shrink-0 my-auto w-5 aspect-square"
                                        />
                                        <a href="mailto:hello@skillbridge.com">
                                            hello@skillbridge.com
                                        </a>
                                    </div>
                                    <div className="flex gap-1 mt-3.5 rounded-md">
                                        <img
                                            loading="lazy"
                                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/4a3ea9408beff8f67037d20eeaa8af01772753db741ac10d13adf25cf2bfa01a?apiKey=9349475655ee4a448868f824f5feb11d&"
                                            alt="Location icon"
                                            className="shrink-0 my-auto w-5 aspect-square"
                                        />
                                        <span>Somewhere in the World</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col ml-5 w-[63%] max-md:ml-0 max-md:w-full">
                                <div className="flex gap-5 items-start px-px max-md:flex-wrap max-md:mt-10">
                                    <div className="flex flex-col flex-1 leading-[150%]">
                                        <h3 className="text-lg font-semibold text-neutral-800">
                                            Home
                                        </h3>
                                        <a
                                            href="#"
                                            className="mt-2.5 text-base text-zinc-600"
                                        >
                                            Our Courses
                                        </a>
                                    </div>
                                    <div className="flex flex-col flex-1 leading-[150%]">
                                        <h3 className="text-lg font-semibold text-neutral-800">
                                            About Us
                                        </h3>
                                        <a
                                            href="#"
                                            className="mt-2.5 text-base text-zinc-600"
                                        >
                                            Our Goals
                                        </a>
                                    </div>
                                    <div className="flex flex-col flex-1 self-stretch max-sm:mb-10">
                                        <h3 className="text-lg font-semibold leading-7 text-neutral-800">
                                            Social Profiles
                                        </h3>
                                        <div className="flex gap-3.5  mt-3.5 max-md:pr-5">
                                            <a
                                                href="#"
                                                className="flex justify-center items-center  w-11 h-11 rounded-md border border-gray-100 border-solid bg-neutral-100"
                                            >
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/512ae15cc801b3851d6dc28b4f5851bfd84f5df3eba63364449a2cfc11dd99bd?apiKey=9349475655ee4a448868f824f5feb11d&"
                                                    alt="Facebook icon"
                                                    className="w-5 aspect-square"
                                                />
                                            </a>
                                            <a
                                                href="#"
                                                className="flex justify-center items-center  w-11 h-11 rounded-md border border-gray-100 border-solid bg-neutral-100"
                                            >
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/553fad1c15c37ba57bb831b26c583dcc987b55cc21b565dd93d7ac6a70290d88?apiKey=9349475655ee4a448868f824f5feb11d&"
                                                    alt="Twitter icon"
                                                    className="w-5 aspect-square"
                                                />
                                            </a>
                                            <a
                                                href="#"
                                                className="flex justify-center items-center  w-11 h-11 rounded-md border border-gray-100 border-solid bg-neutral-100"
                                            >
                                                <img
                                                    loading="lazy"
                                                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/798b0c0c99470f3eedd19f51353f177dc533fa93784e7913ac8527aa67373c38?apiKey=9349475655ee4a448868f824f5feb11d&"
                                                    alt="Instagram icon"
                                                    className="w-5 aspect-square"
                                                />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </>
        )
    );
}
