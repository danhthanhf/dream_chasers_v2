import { useEffect, useState } from "react";
import styles from "./Dashboard.module.scss";
import clsx from "clsx";
import thongKe from "../../assets/images/thongKe.svg";
import CardStatiscal from "../../component/cardTotal";
import * as dataApi from "../../api/apiService/dataService";
import { useSelector } from "react-redux";
import stylesList from "../admin/Course/list/List.module.scss";
import noDataIcon from "../../assets/images/ic_noData.svg";
import avatar from "../../assets/images/avatar_25.jpg";

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]);
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [totalInvoice, setTotalInvoice] = useState(0);
    const user = useSelector((state) => state.login.user);

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await dataApi.getMonthlyStatistic(
                    currentMonth,
                    currentYear
                );
                setInvoices(result.invoicesCreated);
                setCourses(result.coursesCreated);
                setUsers(result.usersRegistered);
                setTotalInvoice(result.invoiceTotal);
            } catch (error) {
                console.log(error);
            }
        };
        fetchApi();
    }, []);
    return (
        <div className="mb-32">
            <div className={clsx("container")}>
                <div className={clsx("row gx-4 gy-4")}>
                    <div
                        className={clsx(
                            styles.greeting,
                            "col-lg-12 rounded-lg",
                            "flex justify-between"
                        )}
                    >
                        <div className={clsx(styles.title, "p-10")}>
                            <h4
                                className={clsx(
                                    styles.green,
                                    "font-semibold text-2xl"
                                )}
                            >
                                Welcom back 👋
                                <br />
                                <strong style={{ textTransform: "capitalize" }}>
                                    {user?.firstName + " " + user?.lastName}
                                </strong>
                            </h4>
                            <span className="text-sm">
                                That is statistical information for{" "}
                                <strong>
                                    {" "}
                                    {monthNames[currentMonth - 1]},{" "}
                                    {currentYear}
                                </strong>
                            </span>
                        </div>
                        <div
                            className={clsx(
                                styles.imgThongKe,
                                "flex items-center"
                            )}
                        >
                            <img src={thongKe} alt="" />
                        </div>
                    </div>

                    <div className="col-lg-4 col-sm-12 rounded-lg">
                        <CardStatiscal
                            title={"Total Active Users"}
                            amount={users?.totalElements}
                        ></CardStatiscal>
                    </div>
                    <div className="col-lg-4 col-sm-12 rounded-lg">
                        <CardStatiscal
                            title={"Total Active Courses"}
                            amount={courses?.totalElements}
                        ></CardStatiscal>
                    </div>
                    <div className="col-lg-4 col-sm-12 rounded-lg">
                        <CardStatiscal
                            title={"Total Balance"}
                            amount={totalInvoice}
                            currency={"VND"}
                        ></CardStatiscal>
                    </div>

                    {/* /?NOTE Table */}
                    <div className="col-lg-6 rounded-lg">
                        <div className="boxShadow p-4 rounded-lg">
                            <div className={clsx("mb-2 pl-6")}>
                                <h4 className="text-base font-semibold">
                                    NEW USER
                                </h4>
                            </div>
                            <hr className="cssHr" />
                            <div className={clsx(stylesList.mid, "mt-4")}>
                                <div
                                    className={clsx(
                                        styles.titleMid,
                                        "row rounded-md py-2 bg-gray-100 text-gray-600 text-sm"
                                    )}
                                >
                                    <div className="col-2 self-center">ID</div>
                                    <div className="col-10">User</div>
                                </div>
                                <div
                                    className={clsx(
                                        stylesList.containerData,
                                        "overflow-y-scroll mt-0 h-[364px] overflow-x-hidden"
                                    )}
                                >
                                    {users &&
                                        users?.content?.map(
                                            (element, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={clsx(
                                                            stylesList.item,
                                                            "row rounded-lg h-[68px]"
                                                        )}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-2"
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.name
                                                                )}
                                                            >
                                                                {element.id}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-10 flex "
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.cssImg
                                                                )}
                                                            >
                                                                <img
                                                                    loading="lazy"
                                                                    src={
                                                                        !element.avatar
                                                                            ? avatar
                                                                            : element.avatar
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <div
                                                                    className={clsx(
                                                                        stylesList.name
                                                                    )}
                                                                >
                                                                    {(element.firstName !==
                                                                    null
                                                                        ? element.firstName
                                                                        : "") +
                                                                        " " +
                                                                        element?.lastName}
                                                                </div>
                                                                <div
                                                                    className={clsx(
                                                                        stylesList.categories
                                                                    )}
                                                                >
                                                                    {
                                                                        element?.email
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    {users?.content?.length === 0 && (
                                        <div
                                            className={clsx(
                                                stylesList.noData,
                                                "flex flex-col justify-center text-center"
                                            )}
                                        >
                                            <img
                                                src={noDataIcon}
                                                alt=""
                                                className={clsx(
                                                    stylesList.noDataImg,
                                                    "m-auto w-32"
                                                )}
                                            />
                                            <span>No Data</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-6 rounded-lg">
                        <div className="boxShadow p-4 rounded-lg">
                            <div className={clsx("mb-2 pl-6")}>
                                <h4 className="text-base font-semibold uppercase">
                                    NEW COURSE
                                </h4>
                            </div>
                            <hr className="cssHr" />
                            <div className={clsx(stylesList.mid, "mt-4")}>
                                <div
                                    className={clsx(
                                        styles.titleMid,
                                        "row rounded-md py-2 bg-gray-100 text-gray-600 text-sm"
                                    )}
                                >
                                    <div className="col-2 self-center">ID</div>
                                    <div className="col-7">Title</div>
                                    <div className="col-3">Price</div>
                                </div>
                                <div
                                    className={clsx(
                                        stylesList.containerData,
                                        "overflow-y-scroll mt-0 h-[364px] overflow-x-hidden"
                                    )}
                                >
                                    {courses &&
                                        courses?.content?.map(
                                            (element, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={clsx(
                                                            stylesList.item,
                                                            "row rounded-lg h-[68px]"
                                                        )}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-2"
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.name
                                                                )}
                                                            >
                                                                {element.id}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-7 flex "
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.cssImg
                                                                )}
                                                            >
                                                                <img
                                                                    src={
                                                                        !element.thumbnail
                                                                            ? avatar
                                                                            : element.thumbnail
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <div
                                                                    className={clsx(
                                                                        stylesList.name,
                                                                        "line-clamp-1 text-wrap"
                                                                    )}
                                                                >
                                                                    {
                                                                        element.title
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-3"
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.name
                                                                )}
                                                            >
                                                                {element?.price ===
                                                                0
                                                                    ? "Free"
                                                                    : element.price.toLocaleString() +
                                                                      " VND"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    {courses?.content?.length === 0 && (
                                        <div
                                            className={clsx(
                                                stylesList.noData,
                                                "flex flex-col justify-center text-center"
                                            )}
                                        >
                                            <img
                                                src={noDataIcon}
                                                alt=""
                                                className={clsx(
                                                    stylesList.noDataImg,
                                                    "m-auto w-32"
                                                )}
                                            />
                                            <span>No Data</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mx-auto col-12 rounded-lg">
                        <div className="boxShadow p-4 rounded-lg">
                            <div className={clsx("mb-2 pl-6")}>
                                <h4 className="text-base font-semibold uppercase">
                                    New Invoice
                                </h4>
                            </div>
                            <hr className="cssHr" />
                            <div className={clsx(stylesList.mid, "mt-4")}>
                                <div
                                    className={clsx(
                                        styles.titleMid,
                                        "row text-sm rounded-md py-2 bg-gray-100 text-gray-600  lg:overflow-x-hidden md:overflow-x-hidden sm:overflow-scroll max-sm:overflow-scroll grid grid-cols-12"
                                    )}
                                >
                                    <div className="col-1 self-center ">ID</div>
                                    <div className="col-lg-4 col-span-8">
                                        User
                                    </div>
                                    <div className="col-3 col-sm-0 sm:hidden max-sm:hidden">
                                        Content
                                    </div>
                                    <div className="col-2 col-sm-0 sm:hidden max-sm:hidden">
                                        Create at
                                    </div>
                                    <div className="col-2">Amount at</div>
                                </div>
                                <div
                                    className={clsx(
                                        stylesList.containerData,
                                        "overflow-y-scroll mt-0 h-[364px] lg:overflow-x-hidden "
                                    )}
                                >
                                    {invoices &&
                                        invoices?.content?.map(
                                            (element, index) => {
                                                const dateTime = new Date(
                                                    element.createdDate
                                                );
                                                const date =
                                                    dateTime.toLocaleDateString();
                                                const time =
                                                    dateTime.toLocaleTimeString();
                                                return (
                                                    <div
                                                        key={index}
                                                        className={clsx(
                                                            stylesList.item,
                                                            "row rounded-lg h-[68px]"
                                                        )}
                                                    >
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-1"
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.name
                                                                )}
                                                            >
                                                                {element.id}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-lg-4 col-md-4 col-sm-6 flex "
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.cssImg
                                                                )}
                                                            >
                                                                <img
                                                                    src={
                                                                        !element
                                                                            ?.user
                                                                            ?.avatar
                                                                            ? avatar
                                                                            : element
                                                                                  .user
                                                                                  .avatar
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <div
                                                                    className={clsx(
                                                                        stylesList.name,
                                                                        "line-clamp-1 text-wrap"
                                                                    )}
                                                                >
                                                                    {element
                                                                        ?.user
                                                                        ?.firstName +
                                                                        " " +
                                                                        element
                                                                            ?.user
                                                                            ?.lastName}
                                                                </div>
                                                                <div
                                                                    className={clsx(
                                                                        stylesList.categories
                                                                    )}
                                                                >
                                                                    {
                                                                        element.methodPayment
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-3 sm:hidden max-sm:hidden"
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.name,
                                                                    "text-wrap line-clamp-2"
                                                                )}
                                                            >
                                                                {
                                                                    element?.content
                                                                }
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-2 sm:hidden max-sm:hidden"
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.name
                                                                )}
                                                            >
                                                                {date}
                                                                <br />
                                                                {time}
                                                            </div>
                                                        </div>
                                                        <div
                                                            className={clsx(
                                                                stylesList.field,
                                                                "col-2"
                                                            )}
                                                        >
                                                            <div
                                                                className={clsx(
                                                                    stylesList.name,
                                                                    "text-xs"
                                                                )}
                                                            >
                                                                {element?.totalInvoice.toLocaleString()}{" "}
                                                                <span className="md:hidden sm:hidden max-sm:hidden">
                                                                    VND
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        )}
                                    {invoices?.content?.length === 0 && (
                                        <div
                                            className={clsx(
                                                stylesList.noData,
                                                "flex flex-col justify-center text-center"
                                            )}
                                        >
                                            <img
                                                src={noDataIcon}
                                                alt=""
                                                className={clsx(
                                                    stylesList.noDataImg,
                                                    "m-auto w-32"
                                                )}
                                            />
                                            <span>No Data</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
