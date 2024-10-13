import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notification",
    initialState: {
        notifications: [],
        totalUnread: 0,
        totalElements: 0,
    },
    reducers: {
        add: (state, action) => {
            state.notifications.unshift(action.payload);
            state.totalElements++;
            state.totalUnread++;
        },
        init: (state, action) => {
            state.notifications = action.payload.notifications;
            state.totalUnread = action.payload.totalUnread;
            state.totalElements = action.payload.totalElements;
        },
        update: (state, action) => {
            var unread = 0;
            state.notifications.map((noti) => {
                if (noti.id === action.payload.id) {
                    noti.read = true;
                    noti.createdAt = action.payload.createdAt;
                }
                if (noti.read === false) {
                    unread++;
                }
                return noti;
            });
            state.totalUnread = unread;
        },
        readAll: (state) => {
            state.notifications.forEach((noti) => {
                noti.read = true;
            });
            state.totalUnread = 0;
        },
        removeAll: (state, action) => {
            state.notifications = [];
            state.totalUnread = 0;
            state.totalElements = 0;
        },
    },
});

export default notificationSlice;
