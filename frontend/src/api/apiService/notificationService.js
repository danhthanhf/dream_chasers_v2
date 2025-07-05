import { notificationInstance } from "../instance";

export const readNotification = async (id) => {
    try {
        return await notificationInstance.put(`${id}/read`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const readAllNotifications = async () => {
    try {
        return await notificationInstance.put(`/readAll`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const removeAllNotifications = async () => {
    try {
        return await notificationInstance.delete(`/removeAll`);
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllUnread = async (pagination) => {
    try {
        const result = await notificationInstance.get(
            `/getAllUnread?page=${pagination.page}&size=${pagination.size}`
        );
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getAllNotification = async (
    type = "all",
    pagination = { page: 0, size: 5 }
) => {
    try {
        const result = await notificationInstance.get(
            `/getAll?type=${type}&page=${pagination.page}&size=${pagination.size}`
        );
        return result.content;
    } catch (error) {
        return Promise.reject(error);
    }
};
