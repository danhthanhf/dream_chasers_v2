import { useEffect, useState } from "react";
import * as statisticService from "../../api/apiService/statisticService";
import styles from "./Dashboard.module.scss";
import clsx from "clsx";
import thongKe from "../../assets/images/thongKe.svg";
import CardStatiscal from "../../component/cardTotal";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import React from "react";
import {
    convertToDayArray,
    convertToMonthArray,
    convertToYearArray,
} from "../../util/index";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import SelectComponent from "../../component/select/SelectComponent";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Chart = ({
    title = "Title",
    propLabel = "Text",
    labels,
    propData,
    propBgColor,
    propBorderColor,
}) => {
    const [selectedTag, setSelectedTag] = useState("year");
    const [dataset, setDataset] = useState(propData);
    const [dataLabel, setDataLabel] = useState(labels);
    useEffect(() => {
        setDataset(propData);
    }, [propData, propLabel]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: title,
            },
        },
    };

    const data = {
        labels: dataLabel,
        datasets: [
            {
                label: propLabel,
                data: dataset,
                backgroundColor: propBgColor,
                borderColor: propBorderColor,
                borderWidth: 1,
                borderRadius: 5,
            },
        ],
    };
    const fetchData = async (timePeriod) => {
        try {
            const result = await statisticService.getStatisticByTypeAndDate(
                propLabel.toLocaleLowerCase(),
                timePeriod
            );
            if (timePeriod === "month") {
                result.data = convertToMonthArray(result.data);
                setDataLabel(monthNames);
            } else if (timePeriod === "day") {
                result.data = convertToDayArray(result.data);
                setDataLabel(days);
            } else if (timePeriod === "year") {
                result.data = convertToYearArray(result.data);
                setDataLabel(years);
            }

            console.log(result.data);
            setDataset(result.data);
        } catch (error) {
            console.log(error);
        }
    };
    const handleSelectTag = (value) => {
        setSelectedTag(value);
        fetchData(value);
    };

    return (
        <div className="b-shadow-sm rounded-lg p-2">
            <div className="flex justify-between items-center">
                <span className="text-xl p-2 rounded-md font-semibold">
                    {title}
                </span>
                <SelectComponent
                    value={selectedTag}
                    handleChange={handleSelectTag}
                    data={dataSelect}
                ></SelectComponent>
            </div>
            <Bar data={data} options={options} />
        </div>
    );
};

const Dashboard = () => {
    const [listCard, setListCard] = useState(initListCard);
    const [listChart, setListChart] = useState(initListChart);
    const user = useSelector((state) => state.login.user);

    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    const updateAllChartAndCart = (data) => {
        const user = convertToYearArray(data.user.data);
        const course = convertToYearArray(data.course.data);
        const post = convertToYearArray(data.post.data);
        const balance = convertToYearArray(data.balance.data);
        console.log(data);
        setListCard((prev) => {
            const update = [...prev];
            update[0] = {
                ...update[0],
                total: data.totalUser,
            };
            update[1] = {
                ...update[1],
                total: data.totalCourse,
            };
            update[2] = {
                ...update[2],
                total: data.totalPost,
            };
            update[3] = {
                ...update[3],
                total: data.totalBalance,
            };
            return update;
        });
        setListChart((prev) => {
            const update = [...prev];
            update[0] = {
                ...update[0],
                propData: user,
            };
            update[1] = {
                ...update[1],
                propData: course,
            };
            update[2] = {
                ...update[2],
                propData: balance,
            };
            update[3] = {
                ...update[3],
                propData: post,
            };
            return update;
        });
    };

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const result = await statisticService.getStatisticAll();
                updateAllChartAndCart(result);
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

                    {listCard.map((item, index) => (
                        <div className="col-lg-3 col-sm-12 rounded-lg">
                            <CardStatiscal
                                title={item?.title}
                                amount={item?.total}
                                icon={item?.icon}
                            ></CardStatiscal>
                        </div>
                    ))}

                    {listChart.map((item, index) => (
                        <div
                            key={Math.random()}
                            className="col-lg-6 col-sm-12 rounded-lg"
                        >
                            <Chart
                                title={item.title}
                                propData={item.propData}
                                propBgColor={item.propBgColor}
                                propLabel={item.propLabel}
                                labels={item.labels}
                                propBorderColor={item.propBorderColor}
                            ></Chart>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
const years = Array.from({ length: 10 }, (_, i) => i + 2021);

const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

const days = Array.from({ length: 30 }, (_, i) => i + 1);

const initListCard = [
    {
        title: "Total Active Users",
        total: 12000,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                />
            </svg>
        ),
    },
    {
        title: "Total Active Courses",
        total: 12000,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                />
            </svg>
        ),
    },
    {
        title: "Total Active Post",
        total: 12000,
        icon: (
            <svg
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="size-6"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                ></path>
            </svg>
        ),
    },
    {
        title: "Total balance",
        total: 12000,
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
            </svg>
        ),
    },
];

const initListChart = [
    {
        title: "New User Registration",
        labels: years,
        text: "User",
        propData: [120, 150, 130, 160, 140, 180, 200, 210, 250, 300, 320, 350],
        propLabel: "User",
        propBgColor: "rgba(255, 99, 132, 0.6)",
        propBorderColor: "rgba(255, 99, 132, 1)",
    },
    {
        title: "New Course Creation",
        labels: years,
        propLabel: "Course",
        propData: [10, 15, 12, 18, 20, 25, 30, 35, 40, 45, 50, 55],
        propBgColor: "rgba(54, 162, 235, 0.6)",
        propBorderColor: "rgba(54, 162, 235, 1)",
    },
    {
        title: "New Balance Transactions",
        labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ],
        text: "New balance",
        propLabel: "Balance",
        propData: [
            500, 600, 550, 700, 650, 800, 850, 900, 950, 1000, 1100, 1200,
        ],
        propBgColor: "rgba(255, 206, 86, 0.6)",
        propBorderColor: "rgba(255, 206, 86, 1)",
    },
    {
        title: "New Posts",
        labels: years,
        text: "New post",
        propLabel: "Post",
        propData: [50, 60, 55, 70, 65, 80, 85, 90, 95, 100, 110, 120],
        propBgColor: "rgba(75, 192, 192, 0.6)",
        propBorderColor: "rgba(75, 192, 192, 1)",
    },
];

const dataSelect = [
    {
        label: "Day",
        value: "day",
    },
    {
        label: "Month",
        value: "month",
    },
    {
        label: "Year",
        value: "year",
    },
];
