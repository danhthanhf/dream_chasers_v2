import moment from "moment";
import { toast } from "sonner";

export const getTimeElapsed = (time) => {
    const now = moment();
    const then = moment(time);
    const diffInSeconds = now.diff(then, "seconds");
    const diffInMinutes = now.diff(then, "minutes");
    const diffInHours = now.diff(then, "hours");
    const diffInDays = now.diff(then, "days");
    const diffInWeeks = now.diff(then, "weeks");
    const diffInMonths = now.diff(then, "months");
    const diffInYears = now.diff(then, "years");
    let timeElapsed;

    if (diffInYears > 0) {
        timeElapsed = `${diffInYears} year ago`;
    } else if (diffInMonths > 0) {
        timeElapsed = `${diffInMonths} month ago`;
    } else if (diffInWeeks > 0) {
        timeElapsed = `${diffInWeeks} week ago`;
    } else if (diffInDays > 0) {
        timeElapsed = `${diffInDays} day ago`;
    } else if (diffInHours > 0) {
        timeElapsed = `${diffInHours} hour ago`;
    } else if (diffInMinutes > 0) {
        timeElapsed = `${diffInMinutes} minute ago`;
    } else {
        timeElapsed = `${diffInSeconds} second ago`;
    }
    return timeElapsed;
};

export const convertSecondsToTime = (seconds) => {
    seconds = Number(seconds);
    var result = "";
    var hour = Math.floor(seconds / 3600);
    var minute = Math.floor((seconds % 3600) / 60);
    var second = Math.floor((seconds % 3600) % 60);
    if (hour > 0) {
        result += hour + "hr ";
    }
    if (minute > 0) {
        result += minute + "min ";
    }
    if (second > 0) {
        result += second + "s";
    }
    return result;
};

export const convertSecondsToHHMMSS = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    let result = "";
    if (hours > 0) {
        result += hours + ":";
    }
    if (minutes > 0) {
        result += minutes + ":";
    } else {
        result += "0:";
    }

    return result + (secs < 10 ? `0${secs}` : secs);
};

export const convertSecondsToRoundTime = (seconds) => {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    if (remainingSeconds > 0) {
        minutes += 1;
    }
    if (minutes >= 60) {
        hours += 1;
        minutes = 0;
    }

    if (hours > 0) {
        return `${hours} hour ${minutes} minute`;
    } else {
        return `${minutes} minute`;
    }
};

export const convertSecondsToTime1 = (seconds) => {
    seconds = Number(seconds);
    var result = "";
    var hour = Math.floor(seconds / 3600);
    var minute = Math.floor((seconds % 3600) / 60);
    var second = Math.floor((seconds % 3600) % 60);
    if (hour > 0) {
        hour > 9 ? (result += hour + ":") : (result += "0" + hour + ":");
    }
    if (minute > 0) {
        minute > 9 ? (result += minute + ":") : (result += "0" + minute + ":");
    } else {
        result += "00:";
    }
    if (second > 0) {
        second > 9 ? (result += second) : (result += "0" + second);
    }
    return result;
};

export const formatStringInUrl = (string) => {
    return encodeURIComponent(string);
};

export const reLogin = () => {
    localStorage.setItem("prevPath", window.location.pathname);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.error("Please login to continue");
    window.location.href = "/login";
};

export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

let timerId;
export const debounce = (func, delay = 300) => {
    return (...args) => {
        if (timerId) {
            clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

export const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);

    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };

    return date.toLocaleString("en-US", options);
};

export const showElementToCenter = (e) => {
    e.currentTarget.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
    });
};

export const isValidContentToSendAI = (content) => {
    const contentLength = content.split(" ").length;
    return contentLength > 20;
};

export const isValidContentToCheckError = (content) => {
    const contentLength = content.split(" ").length;
    return contentLength > 1;
};

export const getCommentIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("commentId");
};

export const formatLikeCount = (num = 0) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(2) + "k";
    }
    return num.toString();
};

export const getFullName = (user) => {
    if (!user) return "";
    return (user.firstName || "") + " " + user.lastName;
};

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

export const convertIntegerToMonthName = (data) => {
    const convertedData = {};

    // Khởi tạo tất cả các tháng với giá trị 0
    monthNames.forEach((month) => {
        convertedData[month] = 0;
    });

    // Cập nhật giá trị cho các tháng có trong dữ liệu gốc
    for (const [key, value] of Object.entries(data)) {
        const monthIndex = parseInt(key, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            const monthName = monthNames[monthIndex];
            convertedData[monthName] = value;
        }
    }

    return convertedData;
};

export const convertToMonthArray = (data) => {
    const monthArray = new Array(12).fill(0); // Khởi tạo mảng với 12 phần tử, giá trị ban đầu là 0

    // Cập nhật giá trị cho các tháng có trong dữ liệu gốc
    for (const [key, value] of Object.entries(data)) {
        const monthIndex = parseInt(key, 10) - 1;
        if (monthIndex >= 0 && monthIndex < 12) {
            monthArray[monthIndex] = value;
        }
    }

    return monthArray;
};

export const convertToDayArray = (data) => {
    const dayArray = new Array(30).fill(0);

    for (const [key, value] of Object.entries(data)) {
        const dayIndex = parseInt(key, 10) - 1;
        if (dayIndex >= 0 && dayIndex < 30) {
            dayArray[dayIndex] = value;
        }
    }

    return dayArray;
};
const years = Array.from({ length: 10 }, (_, i) => i + 2021);
export const convertToYearArray = (data) => {
    const yearArray = new Array(10).fill(0); // Khởi tạo mảng với 10 phần tử, giá trị ban đầu là 0

    // Cập nhật giá trị cho các năm có trong dữ liệu gốc
    for (const [key, value] of Object.entries(data)) {
        const yearIndex = years.indexOf(parseInt(key, 10));
        if (yearIndex !== -1) {
            yearArray[yearIndex] = value;
        }
    }

    return yearArray;
};
