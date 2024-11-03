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
