let timerId = null;

function Debounce(func, delay = 500) {
    return (...args) => {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => {
            func(args);
        }, delay);
    };
}

export default Debounce;
