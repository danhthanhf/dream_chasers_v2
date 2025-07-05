import { chatInstance } from "../instance";

export const readChat = async (chatId) => {
    try {
        const res = await chatInstance.put(`/${chatId}/read`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const deleteChatById = async (chatId) => {
    try {
        const res = await chatInstance.delete(`/${chatId}`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const blockChat = async (chatId) => {
    try {
        const res = await chatInstance.put(`/${chatId}/block`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const unblockChat = async (chatId) => {
    try {
        const res = await chatInstance.post(`/${chatId}/unblock`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const hideNotificationChat = async (chatId) => {
    try {
        const res = await chatInstance.post(`/${chatId}/hide-notification`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getRecentChats = async (page = 0, size = 7) => {
    try {
        const res = await chatInstance.get(`/recent?page=${page}&size=${size}`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const getConversation = async (email) => {
    try {
        const res = await chatInstance.get(`/${email}`);
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};

export const sendMessage = async (email, message) => {
    try {
        const res = await chatInstance.post(`/${email}/send-message`, {
            content: message,
        });
        return res.content;
    } catch (error) {
        return Promise.reject(error);
    }
};
