import moment from "moment";

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
