import axios from "axios";
import { toast } from "sonner";
let redirectPage = null;
export const injectNavigate = (navigate) => {
    redirectPage = navigate;
};

const sessionExpired = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.setItem("prevPath", window.location.pathname);
    toast.error("Session expired, please login again");
    redirectPage("/login");
};

const publicInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/public",
});

publicInstance.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        return Promise.reject(error.response.data);
    }
);

publicInstance.interceptors.request.use(function (config) {
    return config;
});

export const privateInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/private",
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
            console.log(error);
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

export const userInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1/me",
});

userInstance.interceptors.response.use(
    function (res) {
        return res.data;
    },
    function (error) {
        if (error.response.status === 401) {
            sessionExpired();
        }
        return Promise.reject(error.response.data);
    }
);

userInstance.interceptors.request.use(function (config) {
    let token = sessionStorage.getItem("token");
    if (token != null) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default publicInstance;
