import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
    },
    reducers: {
        add: (state, action) => {
            state.notifications.unshift(action.payload);
        },
        init: (state, action) => {
            state.notifications = action.payload;
        },
        update: (state, action) => {
            const index = state.notifications.findIndex(
                (noti) => noti.id === action.payload.id
            );
            state.notifications[index] = action.payload;
        },
        readAll: (state, action) => {
            state.notifications.forEach((noti) => {
                noti.isRead = true;
            });
        },
        removeAll: (state, action) => {
            state.notifications = [];
        },
    },
});

export default notificationSlice;
