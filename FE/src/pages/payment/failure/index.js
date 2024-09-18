import { Link, useLocation, useParams } from "react-router-dom";
import styles from "../Payment.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import * as dataApi from "../../../api/apiService/dataService";
function FailurePayment() {
    const [course, setCourse] = useState({
        price: 0,
        discount: 0,
    });
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const courseId = searchParams.get("courseId");

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getCourseById(courseId);
                setCourse(result.content);
                console.log(result.content);
            } catch (error) {
                console.log(error);
            }
        };

        fetchApi();
    }, [courseId]);

    return (
        <div className="flex ">
            <div className="m-auto flex flex-col justify-center">
                <div className="justify-center flex ml-3 group origin-bottom-right duration-500  hover:-rotate-0 hover:-skew-x-12 hover:-translate-x-6  translate-y-12">
                    <div className="duration-500 group-hover:duration-400 relative rounded-2xl w-80 h-36 bg-zinc-800 text-gray-50 flex flex-col justify-center items-center gap-1 before:-skew-x-12  before:rounded-2xl  before:absolute before:content['']  before:bg-neutral-700 before:right-3 before:top-0 before:w-80 before:h-32 before:-z-10 group-hover:before:-right-3 group-hover:before:skew-x-12 before:duration-500 group-hover:duration-500">
                        <span className="ml-6 text-4xl font-bold">
                            Payment failure!
                        </span>
                        <p className="text-amber-300 font-thin">
                            - Sorry about -
                        </p>
                    </div>
                </div>
                <div className={clsx(styles.boxWrap)}>
                    <h4 className="font-semibold mb-3 uppercase">Your order</h4>
                    <div className={clsx(styles.contentBuild)}>
                        <div className={clsx(styles.itemBuild, "mb-2.5")}>
                            <div>Course:</div>
                            {course && (
                                <div className="font-semibold">
                                    {course.title}
                                </div>
                            )}
                        </div>
                        <div className={clsx(styles.itemBuild, "mb-2.5")}>
                            <div>Original Price:</div>
                            {course.price && (
                                <div>
                                    {course.price.toLocaleString("vi-VN")} VND
                                </div>
                            )}
                        </div>
                        <div className={clsx(styles.itemBuild, "mb-3")}>
                            <div>Discount:</div>
                            {course.discount && (
                                <div>
                                    {course.discount.toLocaleString("vi-VN")}{" "}
                                    VND
                                </div>
                            )}
                        </div>
                        <hr className="cssHr my-3" />
                        <div className={clsx(styles.itemBuild, "mt-3")}>
                            <div className="font-bold text-base">Total</div>
                            <div className="font-bold text-base">
                                {course.discount && course.discount !== 0
                                    ? course.discount.toLocaleString("vi-VN")
                                    : course.price.toLocaleString("vi-VN")}{" "}
                                VND
                            </div>
                        </div>
                    </div>
                </div>
                <div className="text-info-payment text-red-500 text-base font-medium mt-8">
                    Sorry for this unfortunate incident but your payment has
                    failed, please try again.
                </div>
                <div className="flex justify-center gap-2 mt-4">
                    <Link to="/" className="btn-lgbt btn-white">
                        <span>Go home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default FailurePayment;
