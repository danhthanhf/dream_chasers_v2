import avatar from "../../../src/assets/images/avatar_25.jpg";
import logoVNPAY from "../../../src/assets/images/vnpay-logo.jpg";

import clsx from "clsx";
import styles from "./Payment.module.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as userService from "../../api/apiService/userService";
import * as publicService from "../../api/apiService/publicService";
import { toast } from "sonner";

function Payment() {
    const { title } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        price: 0,
        discount: 0,
        title: "Temp course",
    });
    const [paymentType, setPaymentType] = useState();

    const handleMethodPayment = (e) => {
        if (e.target.checked) {
            setPaymentType("vnpay");
        } else {
            setPaymentType("");
        }
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await publicService.getCourseByTitle(title);
                setCourse(result);
            } catch (error) {
                console.log(error);
                toast.error("Error when get course");
            }
        };

        fetchApi();
    }, [title]);

    const handleGetPayment = () => {
        if (paymentType === "vnpay") {
            const fetchApi = async () => {
                try {
                    const result = await userService.getPaymentVNPAY(
                        paymentType,
                        course.id
                    );
                    window.location.href = result;
                } catch (error) {
                    console.log(error);
                }
            };
            fetchApi();
        } else {
            toast.error("Please choose the method payment");
        }
    };

    return (
        <div className={clsx(styles.wrap, "flex")}>
            <div className="mx-auto mt-0 box-md ">
                <div className="row">
                    <div className="col-lg-6">
                        <h2 className="my-8 font-extrabold uppercase">
                            Checkout
                        </h2>
                        <h6 className="font-semibold mb-3 uppercase">
                            Payment method
                        </h6>
                        <div className="">
                            <label
                                htmlFor="vnpay"
                                className={clsx(
                                    styles.itemPayment,
                                    "flex items-center justify-between  mb-12"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="mr-2 ml-2 mt-0.5">
                                        <input
                                            onChange={handleMethodPayment}
                                            id="vnpay"
                                            type="checkbox"
                                            className="input"
                                        />
                                        <span className="custom-checkbox"></span>
                                    </div>
                                    <div className={clsx(styles.wrapCard)}>
                                        <svg
                                            viewBox="0 0 40 26"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="m30.19 21.18h-20.19a1.87 1.87 0 0 1 -1.9-1.85v-12.33a1.88 1.88 0 0 1 1.9-1.82h20.2a1.88 1.88 0 0 1 1.89 1.82v12.3a1.88 1.88 0 0 1 -1.9 1.88z"
                                                fill="#212121"
                                                fillRule="evenodd"
                                            />
                                            <g fill="#fff">
                                                <rect
                                                    height="5"
                                                    rx=".5"
                                                    width="5"
                                                    x="25.09"
                                                    y="17.18"
                                                />
                                                <path
                                                    d="m8.09 12.18h24v-3h-24z"
                                                    fillRule="evenodd"
                                                />
                                            </g>
                                        </svg>
                                    </div>
                                    VNPAY Credit/Debit Card
                                </div>
                                <div className={clsx(styles.wrapLogo)}>
                                    <img src={logoVNPAY} alt="" />
                                </div>
                            </label>
                        </div>
                        <h6 className="font-semibold mb-3 uppercase">
                            Order details
                        </h6>
                        <div
                            className={clsx(
                                "flex items-center justify-between",
                                styles.detail
                            )}
                        >
                            <div className="flex gap-2 flex-1">
                                <img
                                    loading="lazy"
                                    src={course?.thumbnail}
                                    alt="Course images"
                                    className="object-cover"
                                />
                                <div className="text-sm font-bold mr-2">
                                    {course?.title}
                                </div>
                            </div>
                            <div className="text-sm">
                                {
                                    <div className="text-base">
                                        {course?.price.toLocaleString("vi-VN")}{" "}
                                        VND
                                    </div>
                                }
                                {course?.discount !== 0 && (
                                    <div className="line-through">
                                        {course?.discount.toLocaleString(
                                            "vi-VN"
                                        )}{" "}
                                        VND
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={clsx(styles.summary, "col-lg-6")}>
                        <div className={clsx(styles.boxWrap)}>
                            <h4 className="font-semibold mb-3 uppercase">
                                Summnary
                            </h4>
                            <div className={clsx(styles.contentBuild)}>
                                <div className={clsx(styles.itemBuild, "mb-2")}>
                                    <div>Original Price:</div>
                                    {course?.price && (
                                        <div>
                                            {course?.price.toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            VND
                                        </div>
                                    )}
                                </div>
                                <div className={clsx(styles.itemBuild, "mb-3")}>
                                    <div>Discount:</div>
                                    {course?.discount && (
                                        <div>
                                            {course?.discount.toLocaleString(
                                                "vi-VN"
                                            )}{" "}
                                            VND
                                        </div>
                                    )}
                                </div>
                                <hr className="cssHr my-3" />
                                <div className={clsx(styles.itemBuild, "mt-3")}>
                                    <div className="font-bold text-base">
                                        Total
                                    </div>
                                    <div className="font-bold text-base">
                                        {course?.discount &&
                                        course?.discount !== 0
                                            ? course?.discount.toLocaleString(
                                                  "vi-VN"
                                              )
                                            : course?.price.toLocaleString(
                                                  "vi-VN"
                                              )}{" "}
                                        VND
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleGetPayment}
                                className={clsx(styles.btnProceed)}
                            >
                                Proceed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
