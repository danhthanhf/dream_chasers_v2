import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./reducers/loginSlice";
import notificationSlice from "./reducers/notificationSlice";
import adminMenuSlice from "./reducers/adminMenuSlice";
const store = configureStore({
    reducer: {
        login: loginSlice.reducer,
        notification: notificationSlice.reducer,
        adminMneu: adminMenuSlice.reducer,
    },
});

export default store;
