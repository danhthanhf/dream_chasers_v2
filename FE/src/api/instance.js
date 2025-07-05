import axios from "axios";
import { toast } from "sonner";
import loginSlice from "../redux/reducers/loginSlice";
let redirectPage = null;
let dispatcher = null;

export const injectNavigate = (navigate, dispatch) => {
    redirectPage = navigate;
    dispatcher = dispatch;
};

export const sessionExpired = () => {
    toast.error("Session expired, please login again");
    dispatcher(loginSlice.actions.setLogout());
    redirectPage("/login");
};

const publicInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/public",
});

export const securedInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

export const authInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/auth",
});

export const userInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/me",
});

export const notificationInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/notifications",
});

export const privateInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/private",
});

export const instructorInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/instructor",
});

export const chatInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/chats",
});

chatInstance.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        if (error.response.status === 403) {
            toast.error("You don't have permission to access this page");
            redirectPage("/");
        }
        if (error.response.status === 401) {
            sessionExpired();
        }
        return Promise.reject(error.response.data);
    }
);

chatInstance.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem("token");
    if (token != null) config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    return config;
});
securedInstance.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        if (error.response.status === 403) {
            toast.error("You don't have permission to access this page");
            redirectPage("/");
        }
        if (error.response.status === 401) {
            sessionExpired();
        }
        return Promise.reject(error.response.data);
    }
);

securedInstance.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem("token");
    if (token != null) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

notificationInstance.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        if (error.response.status === 403) {
            toast.error("You don't have permission to access this page");
            redirectPage("/");
        }
        if (error.response.status === 401) {
            sessionExpired();
        }
        return Promise.reject(error.response.data);
    }
);

notificationInstance.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem("token");
    if (token != null) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

instructorInstance.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        if (error.response.status === 403) {
            toast.error("You don't have permission to access this page");
            redirectPage("/");
        } else if (error.response.status === 401) {
            sessionExpired();
        }
        return Promise.reject(error.response.data);
    }
);

instructorInstance.interceptors.request.use(function (config) {
    const token = sessionStorage.getItem("token");
    if (token != null) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

publicInstance.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        if (error.response.status === 404) {
            redirectPage("/404");
        }
        return Promise.reject(error.response.data);
    }
);

publicInstance.interceptors.request.use(function (config) {
    return config;
});

privateInstance.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        if (error.response.status === 403) {
            toast.error("You don't have permission to access this page");
            redirectPage("/");
        } else if (error.response.status === 401) {
            sessionExpired();
        }
        return Promise.reject(error.response.data);
    }
);

privateInstance.interceptors.request.use(function (config) {
    let token = sessionStorage.getItem("token");
    if (token != null) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

userInstance.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        console.log(error);
        if (error.response.status === 401) {
            sessionExpired();
        }
        return Promise.reject(error.response.data);
    }
);

userInstance.interceptors.request.use(function (config) {
    let token = sessionStorage.getItem("token");
    if (!token) {
        sessionExpired();
    }
    if (token != null) config.headers.Authorization = `Bearer ${token}`;
    config.headers["Content-Type"] = "application/json";
    return config;
});

export default publicInstance;
