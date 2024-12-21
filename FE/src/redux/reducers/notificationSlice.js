import { createSlice } from "@reduxjs/toolkit";
const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        totalCurrentElements: 0,
        totalUnread: 0,
        totalAllElements: 0,
    },
    reducers: {
        add: (state, action) => {
            const notification = action.payload;
            state.notifications.unshift(notification);
            if (notification.read === false) {
                state.totalUnread++;
            }
            state.totalAllElements++;
        },
        init: (state, action) => {
            state.notifications = action.payload.notifications || [];
            state.totalCurrentElements =
                action.payload.totalCurrentElements || 0;
            state.totalUnread = action.payload.totalUnread || 0;
            state.totalAllElements = action.payload.totalAllElements || 0;
        },
        update: (state, action) => {
            const notification = action.payload;
            state.notifications = state.notifications.map((noti) => {
                if (noti.id === notification.id) {
                    noti.read = true;
                    noti.createdAt = notification.createdAt;
                    state.totalUnread--;
                }
                return noti;
            });
        },
        readAll: (state) => {
            state.notifications.forEach((noti) => {
                noti.read = true;
            });
            state.totalUnread = 0;
        },
        removeAll: (state) => {
            state.notifications = [];
            state.totalUnread = 0;
            state.totalAllElements = 0;
            state.totalCurrentElements = 0;
        },
    },
});

export default notificationSlice;
