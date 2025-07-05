import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./reducers/loginSlice";
import notificationSlice from "./reducers/notificationSlice";
import navSlice from "./reducers/navSlice";
const store = configureStore({
    reducer: {
        login: loginSlice.reducer,
        notification: notificationSlice.reducer,
        nav: navSlice.reducer,
    },
});

export default store;
