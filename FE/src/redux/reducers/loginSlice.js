import { createSlice } from "@reduxjs/toolkit";
import websocketService from "../../service/WebsocketService";

const loginSlice = createSlice({
    name: "login",
    initialState: {
        isLogin: sessionStorage.getItem("token") !== null,
        user: sessionStorage.getItem("user")
            ? JSON.parse(sessionStorage.getItem("user"))
            : null,
        token: sessionStorage.getItem("token"),
    },
    reducers: {
        setLogin: (state, action) => {
            if (action) {
                const { token, user } = action.payload;
                state.user = user;
                state.token = token;
                user && sessionStorage.setItem("user", JSON.stringify(user));
                token && sessionStorage.setItem("token", token);
            }
            state.isLogin = true;
        },
        setLogout: (state, action) => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            localStorage.removeItem("prevPath");
            state.isLogin = false;
            state.user = null;
            websocketService.disconnect();
        },
    },
});

export default loginSlice;
